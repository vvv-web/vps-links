import { describe, expect, it } from 'vitest';

import {
	getProjectBySlug,
	getPrimaryDocLink,
	getProjectSlugs,
	projects,
} from '../src/data/projects';
import { isSectionActive, joinBasePath } from '../src/utils/paths';

describe('projects catalog', () => {
	it('contains the four launch services from the approved plan', () => {
		expect(getProjectSlugs()).toEqual([
			'acom-offer-desk',
			'converter',
			'camunda',
			'llm-webui',
		]);

		expect(projects).toHaveLength(4);
	});

	it('can resolve a project by slug for the dynamic project route', () => {
		expect(getProjectBySlug('camunda')?.title).toBe('Camunda');
		expect(getProjectBySlug('missing-project')).toBeUndefined();
	});

	it('exposes a primary documentation target for each project card', () => {
		expect(getPrimaryDocLink(getProjectBySlug('acom-offer-desk')!)?.href).toBe(
			'https://wiki.acom-offer-desk.ru/services/acom-offer-desk',
		);
		expect(getPrimaryDocLink(getProjectBySlug('converter')!)?.href).toBe(
			'https://wiki.acom-offer-desk.ru/services/converter',
		);
		expect(getPrimaryDocLink(getProjectBySlug('camunda')!)?.href).toBe(
			'https://wiki.acom-offer-desk.ru/services/camunda',
		);
		expect(getPrimaryDocLink(getProjectBySlug('llm-webui')!)?.href).toBe(
			'https://wiki.acom-offer-desk.ru/services/llm-webui',
		);
	});

	it('keeps converter test-branch README in external links', () => {
		expect(getProjectBySlug('converter')?.docsLinks).toContainEqual({
			label: 'README (ветка test)',
			href: 'https://github.com/vvv-web/converter/blob/test/README.md',
		});
	});

	it('keeps converter test-branch RUNBOOK in external links', () => {
		expect(getProjectBySlug('converter')?.docsLinks).toContainEqual({
			label: 'RUNBOOK (ветка test)',
			href: 'https://github.com/vvv-web/converter/blob/test/docs/RUNBOOK.md',
		});
	});
});

describe('base path helpers', () => {
	it('joins project-site base paths without losing slashes or hashes', () => {
		expect(joinBasePath('/vps-links', 'favicon.svg')).toBe('/vps-links/favicon.svg');
		expect(joinBasePath('/vps-links', '/projects/camunda/')).toBe('/vps-links/projects/camunda/');
		expect(joinBasePath('/vps-links', '/#projects')).toBe('/vps-links/#projects');
	});

	it('marks section links as active when the current page is inside that section', () => {
		expect(isSectionActive('/projects/camunda/', '/#projects')).toBe(true);
		expect(isSectionActive('/', '/#projects')).toBe(false);
	});
});
