/**
 * Author: Hudson Silva Borges
 */
import { GraphQLClient, gql } from "graphql-request";
import { has, size } from "lodash";
import { Argument, Option, program } from "commander";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import consola from "consola";
import open from "open";
import { config } from "dotenv";

const query = gql`
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

async function getUserInformation(user: string, client: GraphQLClient) {
  return client.request(query, { user }).then((res) => res.user);
}

config();

program
  .addArgument(new Argument("<users...>"))
  .addHelpCommand()
  .addOption(
    new Option("--token <token>", "Github access token")
      .env("TOKEN")
      .makeOptionMandatory()
  )
  .addOption(
    new Option(
      "--outputDir <dir>",
      "Directory to save the resulting json files"
    ).default(process.cwd())
  )
  .action(
    async (users: string[], opts: { token: string; outputDir: string }) => {
      const outputDir = join(opts.outputDir, "data");

      consola.info(`Resolving output dir (${outputDir}) ...`);
      if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

      consola.info("Creating graphql client ....");
      const client = new GraphQLClient("https://api.github.com/graphql", {
        jsonSerializer: {
          stringify: JSON.stringify,
          parse: (res) =>
            JSON.parse(res, (key, value) => {
              if (value) {
                if (has(value, "totalCount") && size(Object.keys(value)) === 1)
                  return value.totalCount;
                if (key.endsWith("At") || key.endsWith("Date"))
                  return new Date(value);
              }
              return value;
            }),
        },
        headers: { Authorization: `bearer ${opts.token}` },
      });

      for (const user of users) {
        consola.info(`Requesting information from ${user} ...`);
        writeFileSync(
          join(outputDir, `${user}.json`),
          JSON.stringify(await getUserInformation(user, client), null, "  ")
        );
      }

      consola.info("Opening output directory ...");
      await open(outputDir);

      consola.success("Done!");
    }
  )
  .version("0.0.1")
  .parse(process.argv);
