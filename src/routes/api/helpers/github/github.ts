import {
  getOneRepo,
  getOneRepoLanguages,
  getOneRepoPackages,
  getProfileProject,
  getUserRepos,
  searchUserRepos,
} from "./api";

export const githubApi = {
  getUserRepos: async (input: { owner: string }) => {
    return getUserRepos(input);
  },
  searchRepoByName: async (input: { owner: string; keyword: string }) => {
    return searchUserRepos(input);
  },
  getOneRepo: async (input: { owner: string; repo: string }) => {
    return getOneRepo(input);
  },
  getOneRepoLanguages: async (input: { owner: string; repo: string }) => {
    return getOneRepoLanguages(input);
  },
  getOneRepoPackages: async (input: { owner: string; repo: string }) => {
    const repo_pkg = getOneRepoPackages(input);
    return repo_pkg ?? [];
  },
  getProjectFromGithub: async (input: { owner: string; repo: string }) => {
    return getProfileProject(input);
  },
};
