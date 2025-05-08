--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2025-05-08 19:16:35

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 218 (class 1259 OID 16488)
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16487)
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO postgres;

--
-- TOC entry 5005 (class 0 OID 0)
-- Dependencies: 217
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- TOC entry 224 (class 1259 OID 16544)
-- Name: data_sources; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.data_sources (
    id integer NOT NULL,
    shop_id integer,
    last_successful_scrape timestamp without time zone,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.data_sources OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16543)
-- Name: data_sources_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.data_sources_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.data_sources_id_seq OWNER TO postgres;

--
-- TOC entry 5007 (class 0 OID 0)
-- Dependencies: 223
-- Name: data_sources_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.data_sources_id_seq OWNED BY public.data_sources.id;


--
-- TOC entry 231 (class 1259 OID 16704)
-- Name: favorites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.favorites (
    user_id integer NOT NULL,
    product_id integer NOT NULL,
    added_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.favorites OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16721)
-- Name: filters; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.filters (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    display_name character varying(100),
    value text NOT NULL,
    product_id integer
);


ALTER TABLE public.filters OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 16720)
-- Name: filters_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.filters_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.filters_id_seq OWNER TO postgres;

--
-- TOC entry 5010 (class 0 OID 0)
-- Dependencies: 232
-- Name: filters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.filters_id_seq OWNED BY public.filters.id;


--
-- TOC entry 230 (class 1259 OID 16682)
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    price numeric(10,2),
    original_url character varying(512),
    category_id integer,
    shop_id integer,
    brand character varying(100),
    material character varying(100),
    color character varying(50),
    dimensions character varying(50),
    weight numeric(10,2),
    stock_quantity integer DEFAULT 0,
    rating numeric(3,2) DEFAULT 0.0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    images text[],
    image_paths text[]
);


ALTER TABLE public.products OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16681)
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- TOC entry 5012 (class 0 OID 0)
-- Dependencies: 229
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- TOC entry 226 (class 1259 OID 16557)
-- Name: scrape_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.scrape_logs (
    id integer NOT NULL,
    source_id integer,
    status character varying(20) NOT NULL,
    new_items integer DEFAULT 0,
    updated_items integer DEFAULT 0
);


ALTER TABLE public.scrape_logs OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16556)
-- Name: scrape_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.scrape_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.scrape_logs_id_seq OWNER TO postgres;

--
-- TOC entry 5014 (class 0 OID 0)
-- Dependencies: 225
-- Name: scrape_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.scrape_logs_id_seq OWNED BY public.scrape_logs.id;


--
-- TOC entry 220 (class 1259 OID 16498)
-- Name: shops; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shops (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    website character varying(255) NOT NULL,
    contact_email character varying(100),
    contact_phone character varying(20),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.shops OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16497)
-- Name: shops_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.shops_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.shops_id_seq OWNER TO postgres;

--
-- TOC entry 5016 (class 0 OID 0)
-- Dependencies: 219
-- Name: shops_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.shops_id_seq OWNED BY public.shops.id;


--
-- TOC entry 228 (class 1259 OID 16670)
-- Name: sites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sites (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    site character varying(512) NOT NULL,
    shop_name character varying(100) NOT NULL,
    product_link_selector character varying(512),
    name_selector character varying(512),
    description_selector character varying(512),
    price_selector character varying(512),
    brand_selector character varying(512),
    material_selector character varying(512),
    color_selector character varying(512),
    dimension_selector character varying(512),
    weight_selector character varying(512),
    stock_quantity_selector character varying(512),
    rating_selector character varying(512),
    is_active boolean DEFAULT true,
    category_selector character varying(255)
);


ALTER TABLE public.sites OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16669)
-- Name: sites_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sites_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sites_id_seq OWNER TO postgres;

--
-- TOC entry 5018 (class 0 OID 0)
-- Dependencies: 227
-- Name: sites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sites_id_seq OWNED BY public.sites.id;


--
-- TOC entry 222 (class 1259 OID 16515)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role character varying(20) DEFAULT 'user'::character varying,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16514)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 5020 (class 0 OID 0)
-- Dependencies: 221
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4781 (class 2604 OID 16491)
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- TOC entry 4788 (class 2604 OID 16547)
-- Name: data_sources id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.data_sources ALTER COLUMN id SET DEFAULT nextval('public.data_sources_id_seq'::regclass);


--
-- TOC entry 4801 (class 2604 OID 16724)
-- Name: filters id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.filters ALTER COLUMN id SET DEFAULT nextval('public.filters_id_seq'::regclass);


--
-- TOC entry 4795 (class 2604 OID 16685)
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- TOC entry 4790 (class 2604 OID 16560)
-- Name: scrape_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scrape_logs ALTER COLUMN id SET DEFAULT nextval('public.scrape_logs_id_seq'::regclass);


--
-- TOC entry 4783 (class 2604 OID 16501)
-- Name: shops id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shops ALTER COLUMN id SET DEFAULT nextval('public.shops_id_seq'::regclass);


--
-- TOC entry 4793 (class 2604 OID 16673)
-- Name: sites id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sites ALTER COLUMN id SET DEFAULT nextval('public.sites_id_seq'::regclass);


--
-- TOC entry 4785 (class 2604 OID 16518)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4982 (class 0 OID 16488)
-- Dependencies: 218
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, description, created_at) FROM stdin;
1	Диваны и кресла	\N	2025-05-01 18:53:18.584773
2	Шкафы и стеллажи	\N	2025-05-01 18:53:18.584773
3	Кровати и матрасы	\N	2025-05-01 18:53:18.584773
4	Тумбы и комоды	\N	2025-05-01 18:53:18.584773
5	Столы и стулья	\N	2025-05-01 18:53:18.584773
6	Детская мебель	\N	2025-05-01 18:53:18.584773
\.


--
-- TOC entry 4988 (class 0 OID 16544)
-- Dependencies: 224
-- Data for Name: data_sources; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.data_sources (id, shop_id, last_successful_scrape, created_at) FROM stdin;
\.


--
-- TOC entry 4995 (class 0 OID 16704)
-- Dependencies: 231
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.favorites (user_id, product_id, added_at) FROM stdin;
\.


--
-- TOC entry 4997 (class 0 OID 16721)
-- Dependencies: 233
-- Data for Name: filters; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.filters (id, name, display_name, value, product_id) FROM stdin;
1	material	Материал	дерево	\N
2	material	Материал	металл	\N
3	material	Материал	пластик	\N
4	color	Цвет	красный	\N
5	color	Цвет	зеленый	\N
6	color	Цвет	черный	\N
7	size	Размер	мини	\N
8	size	Размер	норм	\N
9	size	Размер	биг	\N
10	availability	Наличие	в наличии	\N
11	availability	Наличие	нет в наличии	\N
12	brand	Бренд	Gucci	\N
13	brand	Бренд	Prada	\N
14	market	Магазин	OZON	\N
15	market	Магазин	Wildberries	\N
16	market	Магазин	Яндекс.Маркет	\N
17	price	Цена	5000	\N
18	price	Цена	10000	\N
19	price	Цена	20000	\N
\.


--
-- TOC entry 4994 (class 0 OID 16682)
-- Dependencies: 230
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, description, price, original_url, category_id, shop_id, brand, material, color, dimensions, weight, stock_quantity, rating, created_at, updated_at, images, image_paths) FROM stdin;
102	Кухня РИТМО (ПЕРВАЯ_МЕБЕЛЬНАЯ_ФАБРИКА_32324) - купить в Санкт-Петербурге	Фасады в натуральном шпоне дуба и ореха, с геометрической вертикальной фрезеровкой. Дизайнерская модель, рекомендованная для создания мебели, интегрированной в пространство — колонн и шкафов до потолка. Планировки для любого помещения. Закажите дизайн-проект или запишитесь на встречу с дизайнером в салоне Первой мебельной фабрики в СПб, Москве, Казани и еще 11 городах РФ.	\N	https://mebelcity.ru/catalog/kukhni/91873-kukhnya_ritmo/	\N	3	\N	\N	\N	\N	\N	\N	\N	2025-05-08 18:49:17.938432	2025-05-08 18:49:17.938432	{https://mebelcity.ru/upload/resize_cache/iblock/889/904_476_1/4fxnrd6r9eh1ell0bn7tj8yqkmi35hfs.jpg}	{full/82092133_4fxnrd6r9eh1ell0bn7tj8yqkmi35hfs.jpg}
103	Кухня СФУМАТО (ПЕРВАЯ_МЕБЕЛЬНАЯ_ФАБРИКА_32602) - купить в Санкт-Петербурге	Суперматовые фасады из термопластика ATG Supramat в дымчатой цветовой палитре. Фасады AGT легки в уходе, свето- и термоустойчивы, обладают повышенной износостойкостью, а микроцарапины на поверхности удаляются под воздействием тепла. Планировки для любого помещения. Закажите дизайн-проект или запишитесь на встречу с дизайнером в салоне Первой мебельной фабрики в СПб, Москве, Казани и еще 11 городах РФ.	\N	https://mebelcity.ru/catalog/kukhni/91874-kukhnya_sfumato/	\N	3	\N	\N	\N	\N	\N	\N	\N	2025-05-08 18:49:19.322947	2025-05-08 18:49:19.322947	{https://mebelcity.ru/upload/resize_cache/iblock/9dd/904_476_1/rc4q8kkhie1pny47ns1lrihui1417y70.jpg}	{full/39706130_rc4q8kkhie1pny47ns1lrihui1417y70.jpg}
104	Кухня КОДА (ПЕРВАЯ_МЕБЕЛЬНАЯ_ФАБРИКА_32618) - купить в Санкт-Петербурге	Фасады из TSS-плит с глубоким тиснением «синхронные поры». Древесные и каменные декоры Cleaf Coda. TSS-плиты обладают высокой жаропрочностью, устойчивостью к ударам, царапинам и воздействию солнечных лучей. Планировки для любого помещения. Закажите дизайн-проект или запишитесь на встречу с дизайнером в салоне Первой мебельной фабрики в СПб, Москве, Казани и еще 11 городах РФ.	\N	https://mebelcity.ru/catalog/kukhni/91875-kukhnya_koda/	\N	3	\N	\N	\N	\N	\N	\N	\N	2025-05-08 18:49:20.299599	2025-05-08 18:49:20.299599	{https://mebelcity.ru/upload/resize_cache/iblock/418/904_476_1/zphy60losidlehw7eyis42byry172jl8.jpg}	{full/67628775_zphy60losidlehw7eyis42byry172jl8.jpg}
105	Кухня ФОРЕСТ (ПЕРВАЯ_МЕБЕЛЬНАЯ_ФАБРИКА_49936) - купить в Санкт-Петербурге	\nКухня ФОРЕСТ — премиальная модель в современном стиле. Фасады ФОРЕСТ облицовываются шпоном дуба в смешанной раскладке MixMatch, создающей естественный рисунок, и тонируются в 4 натуральных оттенках в технике «декапе» для подчеркивания структуры древесины.\n.\n	\N	https://mebelcity.ru/catalog/kukhni/92922-kukhnya_forest/	\N	3	\N	\N	\N	\N	\N	\N	\N	2025-05-08 18:49:21.71614	2025-05-08 18:49:21.71614	{https://mebelcity.ru/upload/resize_cache/iblock/490/904_476_1/pcuvca0yl10s759k3mimm1s204f3t6mp.jpg}	{full/54770223_pcuvca0yl10s759k3mimm1s204f3t6mp.jpg}
106	Кухня АНТАРА (ПЕРВАЯ_МЕБЕЛЬНАЯ_ФАБРИКА_13501) - купить в Санкт-Петербурге	Сочетание сдержанности неоклассики и легкости филигранных линий рамочных фасадов. Выбор взыскательных покупателей, отдающих предпочтение классическому стилю в современном прочтении. Единственная из премиальных кухонь Первой мебельной с возможностью изготовления рамочных фасадов со стеклом, в том числе с использованием витражей. Фасады из МДФ+эмаль. Закажите дизайн-проект или запишитесь на встречу с дизайнером в салон Первой мебельной фабрики.	\N	https://mebelcity.ru/catalog/kukhni/91865-kukhnya_antara/	\N	3	\N	\N	\N	\N	\N	\N	\N	2025-05-08 18:49:22.86528	2025-05-08 18:49:22.86528	{https://mebelcity.ru/upload/resize_cache/iblock/b7a/904_476_1/i486o2gr47e6fplbn4go2oh9yik6jug4.jpg}	{full/45178663_i486o2gr47e6fplbn4go2oh9yik6jug4.jpg}
107	Кухня СТАР (ПЕРВАЯ_МЕБЕЛЬНАЯ_ФАБРИКА_14147) - купить в Санкт-Петербурге	Зеркальный блеск гладких фасадов подчеркнут кромкой «металлик». Безупречный стиль европейской кухни представлен в четырех чистейших цветах: снежно-белом, прохладном сером, угольно-черном и насыщенном красном. Фасады из МДФ с покрытием суперглянцевым пластиком PerfectSense Premium Gloss от Egger. Накладные ручки, tip-on или профиль. Все планировки. Закажите дизайн-проект или запишитесь на встречу с дизайнером в салоне Первой мебельной фабрики.	\N	https://mebelcity.ru/catalog/kukhni/91866-kukhnya_star/	\N	3	\N	\N	\N	\N	\N	\N	\N	2025-05-08 18:49:24.109768	2025-05-08 18:49:24.109768	{https://mebelcity.ru/upload/resize_cache/iblock/26b/904_476_1/almbzsbexjiu4lb4mg5j0bpcn3wascgg.jpg}	{full/60908941_almbzsbexjiu4lb4mg5j0bpcn3wascgg.jpg}
108	Кухня СТРАДА (ПЕРВАЯ_МЕБЕЛЬНАЯ_ФАБРИКА_14149) - купить в Санкт-Петербурге	Продуманный европейский дизайн и высокое качество каждой детали. Фасады модели полностью отделываются натуральным шпоном — дуба, американского ореха или дерева сапели. Все типы ручек: накладные, торцевые, система открывание нажатием, а также профиль на корпусе. Планировка под запросы заказчика. Закажите дизайн-проект или запишитесь на встречу с дизайнером в салон Первой мебельной фабрики.	\N	https://mebelcity.ru/catalog/kukhni/91867-kukhnya_strada/	\N	3	\N	\N	\N	\N	\N	\N	\N	2025-05-08 18:49:25.557493	2025-05-08 18:49:25.557493	{https://mebelcity.ru/upload/resize_cache/iblock/e34/904_476_1/ft8k99wwmoga3a0yueb1hwj9tom90r5f.jpg}	{full/65469267_ft8k99wwmoga3a0yueb1hwj9tom90r5f.jpg}
109	Кухня ЭТЕРНО (ПЕРВАЯ_МЕБЕЛЬНАЯ_ФАБРИКА_14161) - купить в Санкт-Петербурге	Фасады с облицовкой каменным шпоном с каменной кромкой создают уникальный интерьер и привносят в дом независимый дух дикой природы. Каждый фасад покрывается единым слоем каменного шпона, без швов. Шпон срезается с одной каменной плиты, что обеспечивает «родственность» всех фасадов одного гарнитура. Основа фасадов — МДФ. Планировка на заказ. Закажите дизайн-проект или запишитесь на встречу с дизайнером в салон Первой мебельной фабрики.	\N	https://mebelcity.ru/catalog/kukhni/91870-kukhnya_eterno/	\N	3	\N	\N	\N	\N	\N	\N	\N	2025-05-08 18:49:26.210859	2025-05-08 18:49:26.210859	{https://mebelcity.ru/upload/resize_cache/iblock/5f7/904_476_1/9ivst2ov7919lmva9s70np2i0vmi480z.jpg}	{full/73809270_9ivst2ov7919lmva9s70np2i0vmi480z.jpg}
110	Кухня МОДЕНА (ПЕРВАЯ_МЕБЕЛЬНАЯ_ФАБРИКА_14163) - купить в Санкт-Петербурге	Особый набор шпона, сочетающий горизонтальный и вертикальный рисунок, создает тонкую игру светотени на фасадах. Модель сочетает баланс правильных форм, цвета и экологичности и является выбором взыскательных и разборчивых покупателей. Фасады изготавливаются из МДФ и облицовываются натуральным шпоном. Планировки для любого помещения. Закажите дизайн-проект или запишитесь на встречу с дизайнером в салон Первой мебельной фабрики.	\N	https://mebelcity.ru/catalog/kukhni/91871-kukhnya_modena/	\N	3	\N	\N	\N	\N	\N	\N	\N	2025-05-08 18:49:27.55002	2025-05-08 18:49:27.55002	{https://mebelcity.ru/upload/resize_cache/iblock/5a4/904_476_1/murij4japzuwu2qnl9e9ga1uwd0kdice.jpg}	{full/60322217_murij4japzuwu2qnl9e9ga1uwd0kdice.jpg}
111	Кухня ФРЕСКО (ПЕРВАЯ_МЕБЕЛЬНАЯ_ФАБРИКА_17494) - купить в Санкт-Петербурге	ФРЕСКО — универсальная модель-хамелеон, мимикрирующая под различные стили в интерьере, в зависимости от планировки, компоновки секций и декоративного оформления.\n\nФасады кухни ФРЕСКО изготавливаются из прочного, экологически безопасного МДФ\nМДФ (MDF: medium-density fibreboard) — плита из древесного волокна, изготовленная методом горячего прессования. По внешнему виду и свойствам плиты МДФ практически идентичны натуральному дереву, а по прочности и влагостойкости превосходят его. Экологически чистый материал.\nПодробнее\nтолщиной 19 мм. Фрезерованная филенка дополнительно облицовывается ХДФ толщиной 3 мм, делающей поверхность идеально гладкой. Внутренний кант рамки обладает выверенными пропорциями и точеными формами, создающими красивую светотень.	\N	https://mebelcity.ru/catalog/kukhni/91872-kukhnya_fresko/	\N	3	\N	\N	\N	\N	\N	\N	\N	2025-05-08 18:49:28.933682	2025-05-08 18:49:28.933682	{https://mebelcity.ru/upload/resize_cache/iblock/95b/904_476_1/br3vnrjbx0zeytlz3rpdgzju36ctpohc.jpg}	{full/54180606_br3vnrjbx0zeytlz3rpdgzju36ctpohc.jpg}
\.


--
-- TOC entry 4990 (class 0 OID 16557)
-- Dependencies: 226
-- Data for Name: scrape_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.scrape_logs (id, source_id, status, new_items, updated_items) FROM stdin;
\.


--
-- TOC entry 4984 (class 0 OID 16498)
-- Dependencies: 220
-- Data for Name: shops; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shops (id, name, website, contact_email, contact_phone, created_at) FROM stdin;
3	MebelCity	https://mebelcity.ru	\N	\N	2025-05-04 17:33:44.918375
\.


--
-- TOC entry 4992 (class 0 OID 16670)
-- Dependencies: 228
-- Data for Name: sites; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sites (id, name, site, shop_name, product_link_selector, name_selector, description_selector, price_selector, brand_selector, material_selector, color_selector, dimension_selector, weight_selector, stock_quantity_selector, rating_selector, is_active, category_selector) FROM stdin;
2	Akvilon	https://akvilon.online/	Akvilon	div.product-card__content a	h1.product-detail__title	div.product-detail__description	span.product-price__current	a.product-brand__link	\N	\N	\N	\N	\N	\N	t	\N
3	Stolplit SPB	https://spb.stolplit.ru/	Stolplit SPB	div.catalog-item a	h1.product-card__title	div.product-card__desc	span.product-price__current	div.product-card__brand	\N	\N	div.product-card__chars-item:contains("Габариты") span.product-card__chars-value	\N	\N	\N	t	\N
1	MebelCity	https://mebelcity.ru/?setShopID=633	MebelCity	a.item::attr(href)	h1::text	div[itemprop="description"]::text	span.product-price-value::text	span.product-brand-name::text	div.product-params__item:contains("Материал") div.product-params__value::text	div.product-params__item:contains("Цвет") div.product-params__value::text	div.product-params__item:contains("Габариты") div.product-params__value::text	\N	div.product-card__stock:contains("В наличии")	\N	t	\N
\.


--
-- TOC entry 4986 (class 0 OID 16515)
-- Dependencies: 222
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, password_hash, role, created_at) FROM stdin;
1	shovel	abc@mail.ru	6e5a59d4fd56f798e609d28e3d6300b2d80bfbb76d27711c0c24006a129d4e17	user	2025-05-03 15:58:18.021432
\.


--
-- TOC entry 5021 (class 0 OID 0)
-- Dependencies: 217
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 1, false);


--
-- TOC entry 5022 (class 0 OID 0)
-- Dependencies: 223
-- Name: data_sources_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.data_sources_id_seq', 1, false);


--
-- TOC entry 5023 (class 0 OID 0)
-- Dependencies: 232
-- Name: filters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.filters_id_seq', 19, true);


--
-- TOC entry 5024 (class 0 OID 0)
-- Dependencies: 229
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 111, true);


--
-- TOC entry 5025 (class 0 OID 0)
-- Dependencies: 225
-- Name: scrape_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.scrape_logs_id_seq', 1, false);


--
-- TOC entry 5026 (class 0 OID 0)
-- Dependencies: 219
-- Name: shops_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.shops_id_seq', 3, true);


--
-- TOC entry 5027 (class 0 OID 0)
-- Dependencies: 227
-- Name: sites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sites_id_seq', 5, true);


--
-- TOC entry 5028 (class 0 OID 0)
-- Dependencies: 221
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- TOC entry 4803 (class 2606 OID 16496)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 4813 (class 2606 OID 16550)
-- Name: data_sources data_sources_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.data_sources
    ADD CONSTRAINT data_sources_pkey PRIMARY KEY (id);


--
-- TOC entry 4826 (class 2606 OID 16709)
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (user_id, product_id);


--
-- TOC entry 4828 (class 2606 OID 16728)
-- Name: filters filters_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.filters
    ADD CONSTRAINT filters_pkey PRIMARY KEY (id);


--
-- TOC entry 4822 (class 2606 OID 16693)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- TOC entry 4815 (class 2606 OID 16564)
-- Name: scrape_logs scrape_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scrape_logs
    ADD CONSTRAINT scrape_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 4805 (class 2606 OID 16504)
-- Name: shops shops_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shops
    ADD CONSTRAINT shops_pkey PRIMARY KEY (id);


--
-- TOC entry 4817 (class 2606 OID 16678)
-- Name: sites sites_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sites
    ADD CONSTRAINT sites_pkey PRIMARY KEY (id);


--
-- TOC entry 4819 (class 2606 OID 16680)
-- Name: sites sites_site_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sites
    ADD CONSTRAINT sites_site_key UNIQUE (site);


--
-- TOC entry 4824 (class 2606 OID 16736)
-- Name: products unique_item; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT unique_item UNIQUE (original_url, shop_id);


--
-- TOC entry 4807 (class 2606 OID 16526)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4809 (class 2606 OID 16522)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4811 (class 2606 OID 16524)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 4820 (class 1259 OID 16737)
-- Name: products_original_url_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX products_original_url_idx ON public.products USING btree (original_url);


--
-- TOC entry 4829 (class 2606 OID 16551)
-- Name: data_sources data_sources_shop_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.data_sources
    ADD CONSTRAINT data_sources_shop_id_fkey FOREIGN KEY (shop_id) REFERENCES public.shops(id) ON DELETE CASCADE;


--
-- TOC entry 4833 (class 2606 OID 16715)
-- Name: favorites favorites_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- TOC entry 4834 (class 2606 OID 16710)
-- Name: favorites favorites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4835 (class 2606 OID 16729)
-- Name: filters filters_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.filters
    ADD CONSTRAINT filters_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- TOC entry 4831 (class 2606 OID 16694)
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;


--
-- TOC entry 4832 (class 2606 OID 16699)
-- Name: products products_shop_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_shop_id_fkey FOREIGN KEY (shop_id) REFERENCES public.shops(id) ON DELETE SET NULL;


--
-- TOC entry 4830 (class 2606 OID 16565)
-- Name: scrape_logs scrape_logs_source_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scrape_logs
    ADD CONSTRAINT scrape_logs_source_id_fkey FOREIGN KEY (source_id) REFERENCES public.data_sources(id) ON DELETE SET NULL;


--
-- TOC entry 5003 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT ALL ON SCHEMA public TO developers;


--
-- TOC entry 5004 (class 0 OID 0)
-- Dependencies: 218
-- Name: TABLE categories; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.categories TO developers;


--
-- TOC entry 5006 (class 0 OID 0)
-- Dependencies: 224
-- Name: TABLE data_sources; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.data_sources TO developers;


--
-- TOC entry 5008 (class 0 OID 0)
-- Dependencies: 231
-- Name: TABLE favorites; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.favorites TO developers;


--
-- TOC entry 5009 (class 0 OID 0)
-- Dependencies: 233
-- Name: TABLE filters; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.filters TO developers;


--
-- TOC entry 5011 (class 0 OID 0)
-- Dependencies: 230
-- Name: TABLE products; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.products TO developers;


--
-- TOC entry 5013 (class 0 OID 0)
-- Dependencies: 226
-- Name: TABLE scrape_logs; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.scrape_logs TO developers;


--
-- TOC entry 5015 (class 0 OID 0)
-- Dependencies: 220
-- Name: TABLE shops; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.shops TO developers;


--
-- TOC entry 5017 (class 0 OID 0)
-- Dependencies: 228
-- Name: TABLE sites; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.sites TO developers;


--
-- TOC entry 5019 (class 0 OID 0)
-- Dependencies: 222
-- Name: TABLE users; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.users TO developers;


-- Completed on 2025-05-08 19:16:37

--
-- PostgreSQL database dump complete
--

