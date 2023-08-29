import {execSync} from 'child_process'
import config from '../../config.json'

const sanitizeBranchName = (branch: string): string =>
  branch.replace(/[^a-zA-Z0-9-]/g, '') // Ensure DNS safe

const getBranchFromGithubRef = (): string | null => {
  if (process.env.GITHUB_REF) {
    const refArray = process.env.GITHUB_REF.split('/')
    // Assuming it's a branch, take the last part of the split string
    return sanitizeBranchName(refArray[refArray.length - 1])
  }
  return null
}

const getLocalBranchName = (): string => {
  try {
    // if local development, acquire the branch name from the local git configuration
    const branchName = execSync('git rev-parse --abbrev-ref HEAD')
      .toString()
      .trim()

    return sanitizeBranchName(branchName)
  } catch (error) {
    console.error('Error getting branch name:', error)
    return 'local' // Default to 'local' or any fallback you'd prefer if git command fails
  }
}

const getCurrentBranchName = (): string =>
  getBranchFromGithubRef() || getLocalBranchName()

type StaticEnvironment = 'dev' | 'stage' | 'prod'
type EnvironmentConfig = {
  backend_subdomain: string
  frontend_subdomain: string
  deployment: string
}

/**
 * Retrieves the environment configuration based on the provided environment name (which could be a predefined one
 * like 'dev', 'stage', 'prod' or a dynamic branch name for other cases). The returned configuration includes
 * the backend and frontend subdomains specific to that environment or branch.
 * Additionally, it returns the name of the environment or branch as 'deployment'.
 *
 * @param {StaticEnvironment | string} env - The name of the environment or branch. If it matches one of the
 * predefined environments ('dev', 'stage', 'prod'), the configuration for that environment is returned.
 * Otherwise, the configuration is dynamically constructed based on the branch name.
 *
 * @returns {EnvironmentConfig} The corresponding environment configuration, which includes 'backend_subdomain',
 * 'frontend_subdomain', and 'deployment'.
 *
 * @example
 * // For a predefined environment:
 * getEnvironmentConfig('dev');
 * // Returns:
 * // {
 * //   backend_subdomain: "dev-backend-cdk-book",
 * //   frontend_subdomain: "dev-frontend-cdk-book",
 * //   deployment: "dev"
 * // }
 *
 * @example
 * // For a custom branch named 'feature-x':
 * getEnvironmentConfig('feature-x');
 * // Might return:
 * // {
 * //   backend_subdomain: "feature-x-backend-cdk-book",
 * //   frontend_subdomain: "feature-x-frontend-cdk-book",
 * //   deployment: "feature-x"
 * // }
 */
export const getEnvironmentConfig = (
  env: StaticEnvironment | string, // Allow both static and arbitrary string values
): EnvironmentConfig => {
  const deployment =
    env === 'dev' || env === 'stage' || env === 'prod'
      ? env
      : getCurrentBranchName()

  const environmentConfig =
    env in config.environments
      ? config.environments[env as StaticEnvironment]
      : {
          backend_subdomain: `${deployment}-backend-cdk-book`,
          frontend_subdomain: `${deployment}-frontend-cdk-book`,
        }

  return {...environmentConfig, deployment}
}
