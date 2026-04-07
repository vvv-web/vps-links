export type VpsRole = 'Production' | 'Internal' | 'Tools';

export interface ExternalLink {
	label: string;
	href: string;
}

export interface ProjectRecord {
	slug: string;
	title: string;
	description: string;
	publicUrl: string;
	repoUrl?: string;
	primaryDocLink?: ExternalLink;
	docsLinks: ExternalLink[];
	vpsRole: VpsRole;
	surface: string;
	summary: string;
	notes: string[];
}

export interface KnowledgePageRecord {
	slug: string;
	title: string;
	description: string;
	eyebrow: string;
}

export const projects: ProjectRecord[] = [
	{
		slug: 'acom-offer-desk',
		title: 'AcomOfferDesk',
		description:
			'Рабочий контур заявок и коммуникаций: веб-интерфейс, API, gateway и Telegram-бот на одном VPS.',
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
		notes: [
			'Сервис открывается по домену приложения и не зависит от логики витрины.',
			'Основной source of truth по коду находится в форке `vvv-web/AcomOfferDesk`.',
			'Monitoring-доступ остаётся вторичным operational слоем, а не отдельной главной витриной.',
		],
	},
	{
		slug: 'converter',
		title: 'Converter',
		description:
			'Набор сервисов конвертации и документов с отдельными health-check endpoint и публичным reverse proxy.',
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
				label: 'README prototype',
				href: 'https://github.com/vldsmelov/converter/blob/prototype/README.md',
			},
		],
		vpsRole: 'Production',
		surface: 'Document services',
		summary:
			'Публичный сервис конвертации с отдельными маршрутами для NSI, docs и conversion через один домен.',
		notes: [
			'На VPS канонической веткой для развёртывания является `prototype`.',
			'Подробный VPS runbook сейчас зафиксирован локально на Desktop и свёрнут во внутреннюю docs-секцию этой страницы.',
			'Runbook описывает loopback-порты, пересборку compose и health-check маршруты.',
			'Статика и backend-контур обновляются независимо, поэтому документация особенно важна.',
		],
	},
	{
		slug: 'camunda',
		title: 'Camunda',
		description:
			'Публичный вход в Camunda 8 on-prem через VPS-шлюз с доступом к Operate, Tasklist, Modeler и REST API.',
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
		notes: [
			'Главный пользовательский вход начинается с Operate, Tasklist и Web Modeler.',
			'REST API и Keycloak admin остаются доступны как отдельные маршруты под тем же доменом.',
			'Внутренняя сводка на этой странице собрана из локальных `PROJECT_INFO.md` и `ACCESS_FOR_TEAM.md`, потому что GitHub-репозиторий проекта приватный.',
			'Operational docs описывают маршрут VPS → Tailscale → upstream-контур и сценарии доступа.',
		],
	},
	{
		slug: 'llm-webui',
		title: 'LLM / Open WebUI',
		description:
			'Пара публичных точек для LLM API и браузерного GUI: прокси LiteLLM и отдельный Open WebUI.',
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
		notes: [
			'Витрина ссылается только на публичные точки входа без публикации ключей и внутренних `.env` деталей.',
			'Для API-клиентов основной маршрут — `GET /models` и `POST /chat/completions`.',
			'GUI используется как вторичный слой для ручной работы и оценки интерфейса.',
		],
	},
];

export const vpsKnowledgePages: KnowledgePageRecord[] = [
	{
		slug: 'access',
		title: 'Доступ',
		description:
			'Как быстро понять, куда переходить: сервисы, GitHub-источники и публичные точки входа.',
		eyebrow: 'Entry map',
	},
	{
		slug: 'deploy',
		title: 'Развертывание',
		description:
			'Короткая карта развёртывания: от GitHub ветки и Actions до pull/build на VPS.',
		eyebrow: 'Release path',
	},
	{
		slug: 'troubleshooting',
		title: 'Troubleshooting',
		description:
			'Где смотреть в первую очередь, если сервис не открывается или внешняя ссылка ведёт на ошибку.',
		eyebrow: 'First response',
	},
	{
		slug: 'monitoring',
		title: 'Мониторинг',
		description:
			'Какие сервисы уже имеют operational-слой и какие внешние документы использовать для проверки.',
		eyebrow: 'Signals',
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
