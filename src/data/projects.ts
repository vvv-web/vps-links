export type VpsRole = 'Production' | 'Internal' | 'Tools';

export interface ExternalLink {
	label: string;
	href: string;
}

export interface ProjectRecord {
	slug: string;
	title: string;
	publicUrl: string;
	repoUrl?: string;
	primaryDocLink?: ExternalLink;
	docsLinks: ExternalLink[];
	vpsRole: VpsRole;
	surface: string;
	summary: string;
}

export const projects: ProjectRecord[] = [
	{
		slug: 'acom-offer-desk',
		title: 'AcomOfferDesk',
		publicUrl: 'https://app.acom-offer-desk.ru/',
		repoUrl: 'https://github.com/vvv-web/AcomOfferDesk',
		primaryDocLink: {
			label: 'Внутренняя wiki',
			href: 'https://wiki.acom-offer-desk.ru/services/acom-offer-desk',
		},
		docsLinks: [
			{
				label: 'Внутренняя wiki',
				href: 'https://wiki.acom-offer-desk.ru/services/acom-offer-desk',
			},
			{
				label: 'README проекта',
				href: 'https://github.com/vvv-web/AcomOfferDesk#readme',
			},
		],
		vpsRole: 'Production',
		surface: 'Production contour',
		summary:
			'Публичная точка входа для основного приложения и связанного monitoring-view без отдельного backend в витрине.',
	},
	{
		slug: 'converter',
		title: 'Converter',
		publicUrl: 'https://converter.acom-offer-desk.ru/',
		repoUrl: 'https://github.com/vvv-web/converter',
		primaryDocLink: {
			label: 'Внутренняя wiki',
			href: 'https://wiki.acom-offer-desk.ru/services/converter',
		},
		docsLinks: [
			{
				label: 'Внутренняя wiki',
				href: 'https://wiki.acom-offer-desk.ru/services/converter',
			},
			{
				label: 'Репозиторий форка',
				href: 'https://github.com/vvv-web/converter',
			},
			{
				label: 'README (ветка test)',
				href: 'https://github.com/vvv-web/converter/blob/test/README.md',
			},
			{
				label: 'RUNBOOK (ветка test)',
				href: 'https://github.com/vvv-web/converter/blob/test/docs/RUNBOOK.md',
			},
		],
		vpsRole: 'Production',
		surface: 'Document services',
		summary:
			'Публичный сервис конвертации с отдельными маршрутами для NSI, docs и conversion через один домен.',
	},
	{
		slug: 'camunda',
		title: 'Camunda',
		publicUrl: 'https://camunda.acom-offer-desk.ru/operate',
		primaryDocLink: {
			label: 'Внутренняя wiki',
			href: 'https://wiki.acom-offer-desk.ru/services/camunda',
		},
		docsLinks: [
			{
				label: 'Внутренняя wiki',
				href: 'https://wiki.acom-offer-desk.ru/services/camunda',
			},
			{
				label: 'Camunda Operate docs',
				href: 'https://docs.camunda.io/docs/components/operate/operate-introduction/',
			},
			{
				label: 'Camunda REST API overview',
				href: 'https://docs.camunda.io/docs/apis-tools/camunda-api-rest/camunda-api-rest-overview/',
			},
		],
		vpsRole: 'Internal',
		surface: 'Process orchestration',
		summary:
			'VPS выступает публичной точкой входа и прокси-слоем к Camunda-кластеру на корпоративном сервере.',
	},
	{
		slug: 'llm-webui',
		title: 'LLM / Open WebUI',
		publicUrl: 'https://llm.acom-offer-desk.ru/',
		primaryDocLink: {
			label: 'Внутренняя wiki',
			href: 'https://wiki.acom-offer-desk.ru/services/llm-webui',
		},
		docsLinks: [
			{
				label: 'Внутренняя wiki',
				href: 'https://wiki.acom-offer-desk.ru/services/llm-webui',
			},
			{
				label: 'Open WebUI GUI',
				href: 'https://webui.acom-offer-desk.ru/',
			},
		],
		vpsRole: 'Tools',
		surface: 'AI access layer',
		summary:
			'Публичный LLM gateway и GUI отделены от основной витрины: API живёт на одном домене, пользовательский интерфейс — на другом.',
	},
];

export function getProjectSlugs(): string[] {
	return projects.map((project) => project.slug);
}

export function getProjectBySlug(slug: string): ProjectRecord | undefined {
	return projects.find((project) => project.slug === slug);
}

export function getPrimaryDocLink(project: ProjectRecord): ExternalLink | undefined {
	return project.primaryDocLink ?? project.docsLinks[0];
}
