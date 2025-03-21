# CUpido App

 Please read this document carefully as it outlines our conventions and process for all developers.

---

## Table of Contents

- [Git Branching and Commit Message Guidelines](#git-branching-and-commit-message-guidelines)
- [CI/CD Pipeline Overview](#cicd-pipeline-overview)
- [Workflow Steps](#workflow-steps)
  - [1. Initial Repository Setup](#1-initial-repository-setup)
  - [2. Working on a Feature Branch](#2-working-on-a-feature-branch)
  - [3. Pushing Changes & CI Checks](#3-pushing-changes--ci-checks)
  - [4. Fixing Commit Message Errors](#4-fixing-commit-message-errors)
  - [5. Pull Request and Merging Process](#5-pull-request-and-merging-process)
---


## Git Branching and Commit Message Guidelines

### Branching:

Work on a feature branch for each new feature or fix. The naming convention is:

```bash
feature/your-feature-name
```

### Commit Message Convention:

All commit messages must follow the **Conventional Commits** format. Examples:

```bash
type(scope?): subject #scope is optional; multiple scopes are supported (current delimiter options: "/", "\" and ",")

# Here are some examples:
commit -m "feat: add login endpoint" # feat stands for feature, 这个是最常用的
commit -m "fix(API): correct typo in API response"
```

> **Note:** Our CI pipeline includes a commit message linting job that will flag and fail any commit messages that do not follow these rules. Check https://github.com/conventional-changelog/commitlint/#what-is-commitlint for complete rules.

---

## CI/CD Pipeline Overview

Our GitHub Actions workflow handles several tasks:

- **Commit Message Linting:** Validates that all commit messages adhere to the Conventional Commits format.
- **Build and Test (Optional):** Steps to restore, build, and test the .NET backend and frontend. *(Currently commented out as the API is partially written.)*
- **Docker Build/Push & Deployment:** Jobs to build and push the Docker image and deploy to Fly.io. *(Run only on the main branch and commented out until configurations are fully set up.)*

The complete CI/CD pipeline is defined in the `.github/workflows/ci.yml` file in the repository.

---

## Workflow Steps

### 1. Initial Repository Setup

- Clone this repository if you haven't.

### 2. Working on a Feature Branch

- Create a Feature Branch:
  ```bash
  git checkout -b feature/new-feature
  git pull origin main # sync with remote github repo
  ```
- Develop your feature:
  - Make changes and commit frequently.
  - Ensure every commit message follows the Conventional Commits format (e.g., `feat: add new feature X`).

### 3. Pushing Changes & CI Checks

- Push Your Feature Branch:
  ```bash
  git push origin feature/new-feature
  ```
  - This command pushes your local feature/new-feature branch to the remote repository. If the branch does not exist remotely, it will be created. Once pushed, you can create a pull request to merge your changes into the target branch.

- CI Pipeline Runs Automatically:
  - Commitlint job checks each commit message.
  - Invalid commit messages cause CI jobs to fail.
  - Build/test steps (if uncommented) and Docker jobs run as configured.
- **Check the github to see if the push is successful!!!!**

### 4. Fixing Commit Message Errors

If you encounter commit message errors on GitHub:

```sql
Error: You have commit messages with errors

⧗   input: your_wrong_commit_message
✖   subject may not be empty [subject-empty]
✖   type may not be empty [type-empty]
```

- **For the Most Recent Commit:**

  Amend the commit message:

  ```bash
  git commit --amend -m "feat: meaningful feature message"
  ```

  Force push the amended commit:

  ```bash
  git push --force origin feature/new-feature
  ```

- **For Multiple Commits:**

  Interactive Rebase:

  ```bash
  git rebase -i HEAD~N
  ```

  *(Replace **`N`** with the number of commits to fix.)*

  - Change `pick` to `reword` for commits needing updates.
  - Update commit messages to follow Conventional Commits.

  Complete the rebase and force push:

  ```bash
  git push --force origin feature/new-feature
  ```

### 5. Pull Request and Merging Process

- **Open a Pull Request (PR):**

  - On GitHub, create a PR from your feature branch (e.g., `feature/new-feature`) to `main`.
  - The CI pipeline will run again on the PR.
  - If commit message is wrong, it cannot be merged into the main branch, you should do step 4.

- **Review and Approve:**

  - Team members review the PR.
  - Ensure all CI jobs pass and commit messages are correct.

- **Merge the PR:**

  - Once approved and all checks pass, merge the PR into `main`.

- **Deployment:**

  - After merging, Docker build/push and Fly.io deployment jobs (configured to run on `main`) will execute if enabled.

---


