"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Author: Hudson Silva Borges
 */
const graphql_request_1 = require("graphql-request");
const lodash_1 = require("lodash");
const commander_1 = require("commander");
const fs_1 = require("fs");
const path_1 = require("path");
const consola_1 = __importDefault(require("consola"));
const open_1 = __importDefault(require("open"));
const dotenv_1 = require("dotenv");
const bluebird_1 = require("bluebird");
const format_1 = require("@fast-csv/format");
const adm_zip_1 = __importDefault(require("adm-zip"));
(0, dotenv_1.config)();
const query = (0, graphql_request_1.gql) `
  query ($user: String!) {
    user(login: $user) {
      anyPinnableItems
      avatarUrl
      bio
      # bioHTML
      commitComments(first: 0) {
        totalCount
      }
      company
      # companyHTML
      contributionsCollection {
        earliestRestrictedContributionDate
        latestRestrictedContributionDate
      }
      createdAt
      databaseId
      email
      estimatedNextSponsorsPayoutInCents
      followers(first: 0) {
        totalCount
      }
      following(first: 0) {
        totalCount
      }
      gists(first: 0) {
        totalCount
      }
      hasSponsorsListing
      # hovercard {
      #   contexts {
      #     message
      #     octicon
      #   }
      # }
      id
      interactionAbility {
        expiresAt
      }
      isBountyHunter
      isCampusExpert
      isDeveloperProgramMember
      isEmployee
      isFollowingViewer
      isGitHubStar
      isHireable
      isSiteAdmin
      # isSponsoredBy(accountLogin: "mtov")
      isSponsoringViewer
      isViewer
      issueComments(first: 0) {
        totalCount
      }
      issues(first: 0) {
        totalCount
      }
      itemShowcase {
        hasPinnedItems
        items(first: 0) {
          totalCount
        }
      }
      location
      login
      monthlyEstimatedSponsorsIncomeInCents
      name
      # organization
      # organizationVerifiedDomainEmails
      organizations(first: 0) {
        totalCount
      }
      packages(first: 0) {
        totalCount
      }
      pinnableItems(first: 0) {
        totalCount
      }
      projects(first: 0) {
        totalCount
      }
      projectsUrl
      projectsV2(first: 0) {
        totalCount
      }
      publicKeys(first: 0) {
        totalCount
      }
      pullRequests(first: 0) {
        totalCount
      }
      recentProjects(first: 0) {
        totalCount
      }
      repositories(first: 0) {
        totalCount
      }
      repositoriesContributedTo(first: 0) {
        totalCount
      }
      repositoryDiscussionComments(first: 0) {
        totalCount
      }
      repositoryDiscussions(first: 0) {
        totalCount
      }
      resourcePath
      sponsoring(first: 0) {
        totalCount
      }
      sponsors(first: 0) {
        totalCount
      }
      sponsorsActivities(first: 0) {
        totalCount
      }
      sponsorsListing {
        id
      }
      sponsorshipForViewerAsSponsor {
        id
      }
      sponsorshipForViewerAsSponsorable {
        id
      }
      sponsorshipNewsletters(first: 0) {
        totalCount
      }
      sponsorshipsAsMaintainer(first: 0) {
        totalCount
      }
      sponsorshipsAsSponsor(first: 0) {
        totalCount
      }
      starredRepositories(first: 0) {
        totalCount
      }
      status {
        message
      }
      topRepositories(
        first: 0
        orderBy: { field: STARGAZERS, direction: DESC }
      ) {
        totalCount
      }
      twitterUsername
      updatedAt
      url
      watching(first: 0) {
        totalCount
      }
      websiteUrl
    }
  }
`;
function getUserInformation(user, client) {
    return __awaiter(this, void 0, void 0, function* () {
        return client.request(query, { user }).then((res) => res.user);
    });
}
const Formats = { json: "json", csv: "csv", "json-per-user": "zip" };
const { version } = require("../package.json");
commander_1.program
    .addArgument(new commander_1.Argument("<users...>"))
    .addHelpCommand()
    .addOption(new commander_1.Option("--token <token>", "Github access token")
    .env("TOKEN")
    .makeOptionMandatory())
    .addOption(new commander_1.Option("--outputDir <dir>", "Directory to save the resulting json files").default(process.cwd()))
    .addOption(new commander_1.Option("--format <format>", "File format")
    .choices(Object.keys(Formats))
    .default(Object.keys(Formats).at(0)))
    .action((users, opts) => __awaiter(void 0, void 0, void 0, function* () {
    consola_1.default.info(`Resolving output dir (${opts.outputDir}) ...`);
    if (!(0, fs_1.existsSync)(opts.outputDir))
        (0, fs_1.mkdirSync)(opts.outputDir, { recursive: true });
    consola_1.default.info("Creating graphql client ....");
    const client = new graphql_request_1.GraphQLClient("https://api.github.com/graphql", {
        jsonSerializer: {
            stringify: JSON.stringify,
            parse: (res) => JSON.parse(res, (key, value) => {
                if (value) {
                    if ((0, lodash_1.has)(value, "totalCount") && (0, lodash_1.size)(Object.keys(value)) === 1)
                        return value.totalCount;
                    if (key.endsWith("At") || key.endsWith("Date"))
                        return new Date(value);
                }
                return value;
            }),
        },
        headers: { Authorization: `bearer ${opts.token}` },
    });
    const data = yield (0, bluebird_1.mapSeries)(users, (user) => {
        consola_1.default.info(`Requesting information from ${user} ...`);
        return getUserInformation(user, client);
    });
    const fileName = `ghuserinfo-${Date.now()}.${Formats[opts.format]}`;
    const fileDest = (0, path_1.join)(opts.outputDir, fileName);
    consola_1.default.info(`Writing results to ${fileName} ...`);
    switch (opts.format) {
        case "json": {
            (0, fs_1.writeFileSync)(fileDest, JSON.stringify(data, null, "  "));
            break;
        }
        case "csv": {
            (0, format_1.writeToPath)(fileDest, data, { headers: true });
            break;
        }
        case "json-per-user": {
            const zip = new adm_zip_1.default();
            data.forEach((content, index) => zip.addFile(`${users[index]}.json`, Buffer.from(JSON.stringify(content, null, "  "))));
            yield zip.writeZipPromise(fileDest);
            break;
        }
        default:
            throw new Error("Unknown file format!");
    }
    consola_1.default.info("Opening output directory ...");
    yield (0, open_1.default)(opts.outputDir);
    consola_1.default.success("Done!");
}))
    .version(version)
    .parse(process.argv);
