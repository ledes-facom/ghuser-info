# Github-User-Info

`ghuser-info` é uma ferramenta que permite a coleta de informações de usuários cadastrados na plataforma Gitbhub.

A ferramenta coleta todas as informações básicas disponíveis na GraphQL API do GitHub e exporta os dados para diferentes formatos: json, csv e json por usuário.

## Como Usar

Para usar a ferramenta você pode instalar globalmente usando o `npm`:

``` bash
npm install -g ledes-facom/ghuser-info
```

Depois disso você poderá usar a ferramenta pelo comando `ghuser-info`.

IMPORTANTE: Para utilizar você deve prover um token de acesso do Github para:

``` bash
ghuser-info --token xxxxxxxxxxxxxx --format json hsborges
# ou via variável de ambiente
TOKEN=xxxxxxxxxxxxxx ghuser-info --format json hsborges
```

O trecho abaixo ilustra a saída para a consulta de exemplo:

``` json
[
  {
    "anyPinnableItems": true,
    "avatarUrl": "https://avatars.githubusercontent.com/u/2676029?v=4",
    "bio": "",
    "commitComments": 0,
    "company": "Federal University of Mato Grosso do Sul",
    "contributionsCollection": {
      "earliestRestrictedContributionDate": null,
      "latestRestrictedContributionDate": null
    },
    "createdAt": "2012-10-29T14:33:22.000Z",
    "databaseId": 2676029,
    "email": "my@email.com",
    "estimatedNextSponsorsPayoutInCents": 0,
    "followers": 42,
    "following": 2,
    "gists": 0,
    "hasSponsorsListing": false,
    "id": "MDQ6VXNlcjI2NzYwMjk=",
    "interactionAbility": null,
    "isBountyHunter": false,
    "isCampusExpert": false,
    "isDeveloperProgramMember": false,
    "isEmployee": false,
    "isFollowingViewer": true,
    "isGitHubStar": false,
    "isHireable": false,
    "isSiteAdmin": false,
    "isSponsoringViewer": false,
    "isViewer": false,
    "issueComments": 18,
    "issues": 25,
    "itemShowcase": {
      "hasPinnedItems": false,
      "items": 30
    },
    "location": "Campo Grande, MS, Brazil.",
    "login": "hsborges",
    "monthlyEstimatedSponsorsIncomeInCents": 0,
    "name": "Hudson SIlva Borges",
    "organizations": 1,
    "packages": 0,
    "pinnableItems": 43,
    "projects": 0,
    "projectsUrl": "https://github.com/users/hsborges/projects",
    "projectsV2": 0,
    "publicKeys": 3,
    "pullRequests": 21,
    "recentProjects": 0,
    "repositories": 35,
    "repositoriesContributedTo": 8,
    "repositoryDiscussionComments": 0,
    "repositoryDiscussions": 0,
    "resourcePath": "/hsborges",
    "sponsoring": 0,
    "sponsors": 0,
    "sponsorsActivities": 0,
    "sponsorsListing": null,
    "sponsorshipForViewerAsSponsor": null,
    "sponsorshipForViewerAsSponsorable": null,
    "sponsorshipNewsletters": 0,
    "sponsorshipsAsMaintainer": 0,
    "sponsorshipsAsSponsor": 0,
    "starredRepositories": 178,
    "status": null,
    "topRepositories": 10,
    "twitterUsername": "hudsonsilbor",
    "updatedAt": "2022-08-17T04:09:11.000Z",
    "url": "https://github.com/hsborges",
    "watching": 35,
    "websiteUrl": null
  }
]
```
