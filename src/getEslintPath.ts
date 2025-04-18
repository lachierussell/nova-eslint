function getPathFromConfig(): string | null {
	const configExecPath =
		nova.workspace.config.get(
			"com.parkcedar.eslint.config.eslintPath",
			"string",
		) ??
		nova.config.get("com.parkcedar.eslint.config.eslintPath", "string");

	if (configExecPath) {
		if (nova.path.isAbsolute(configExecPath)) {
			return configExecPath;
		} else if (nova.workspace.path) {
			return nova.path.join(nova.workspace.path, configExecPath);
		} else {
			nova.workspace.showErrorMessage(
				"Save your workspace before using a relative ESLint executable path.",
			);
			return null;
		}
	}
	return null;
}

function getPathFromLocal(): string | null {
	return null;
}

function getPathFromGlobal(): string | null {
	return null;
}

function getPriorityPath(): string | null {
	// Config options set? these should override anything local.
	let path: string | null;

	path = getPathFromConfig();
	if (path) return path;

	path = getPathFromLocal();
	if (path) return path;

	path = getPathFromGlobal();
	if (path) return path;

	return null;
}

async function setErrorMessage(path: string | null) {
	const request = new NotificationRequest("eslint-not-found");

	request.title = nova.localize("ESLint Executable Not Found");
	request.body = nova.localize(`Couldn't find or execute ${path}`);

	return nova.notifications.add(request);
}

// this determines where the eslint executable is
export async function getEslintPath(): Promise<string | null> {
	let execPath = getPriorityPath();
	const warnPath = execPath;

	// Configured doesn't work; or
	// No eslint configured (throw a single error - maybe use a toast to avoid hogging the screen).
	if (execPath) {
		if (!nova.fs.access(execPath, nova.fs.X_OK)) {
			execPath = null;
		}
	}

	if (execPath === null) {
		setErrorMessage(warnPath)
	}

	return execPath;
}
