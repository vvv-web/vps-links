import { describe, expect, it } from 'vitest';

import {
	getProjectBySlug,
	getPrimaryDocLink,
	getProjectSlugs,
	projects,
	vpsKnowledgePages,
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

	it('keeps converter prototype documentation visible in external links', () => {
		expect(getProjectBySlug('converter')?.docsLinks).toContainEqual({
			label: 'README (ветка prototype)',
			href: 'https://github.com/vvv-web/converter/blob/prototype/README.md',
		});
	});
});

describe('knowledge pages', () => {
	it('exposes the four internal knowledge routes from the design spec', () => {
		expect(vpsKnowledgePages.map((page) => page.slug)).toEqual([
			'access',
			'deploy',
			'troubleshooting',
			'monitoring',
		]);
	});
});

describe('base path helpers', () => {
	it('joins project-site base paths without losing slashes or hashes', () => {
		expect(joinBasePath('/vps-links', 'favicon.svg')).toBe('/vps-links/favicon.svg');
		expect(joinBasePath('/vps-links', '/projects/camunda/')).toBe('/vps-links/projects/camunda/');
		expect(joinBasePath('/vps-links', '/#knowledge')).toBe('/vps-links/#knowledge');
	});

	it('marks section links as active when the current page is inside that section', () => {
		expect(isSectionActive('/projects/camunda/', '/#projects')).toBe(true);
		expect(isSectionActive('/knowledge/access/', '/#knowledge')).toBe(true);
		expect(isSectionActive('/', '/#projects')).toBe(false);
	});
});
