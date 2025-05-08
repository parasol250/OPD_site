--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2025-05-09 00:14:57

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
-- TOC entry 4937 (class 0 OID 0)
-- Dependencies: 229
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- TOC entry 4772 (class 2604 OID 16685)
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- TOC entry 4930 (class 0 OID 16682)
-- Dependencies: 230
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, description, price, original_url, category_id, shop_id, brand, material, color, dimensions, weight, stock_quantity, rating, created_at, updated_at, images, image_paths) FROM stdin;
132	Кухня ФОРЕСТ (ПЕРВАЯ_МЕБЕЛЬНАЯ_ФАБРИКА_49936) - купить в Санкт-Петербурге	\N	288480.00	https://mebelcity.ru/catalog/kukhni/92922-kukhnya_forest/	\N	3	\N	\N	\N	\N	\N	\N	\N	2025-05-08 22:26:18.268899	2025-05-08 22:26:18.268899	{https://mebelcity.ru/upload/resize_cache/iblock/490/904_476_1/pcuvca0yl10s759k3mimm1s204f3t6mp.jpg}	{full/60334295_pcuvca0yl10s759k3mimm1s204f3t6mp.jpg}
133	Кухня АНТАРА (ПЕРВАЯ_МЕБЕЛЬНАЯ_ФАБРИКА_13501) - купить в Санкт-Петербурге	\N	191520.00	https://mebelcity.ru/catalog/kukhni/91865-kukhnya_antara/	\N	3	\N	\N	\N	\N	\N	\N	\N	2025-05-08 22:26:19.554546	2025-05-08 22:26:19.554546	{https://mebelcity.ru/upload/resize_cache/iblock/b7a/904_476_1/i486o2gr47e6fplbn4go2oh9yik6jug4.jpg}	{full/77748791_i486o2gr47e6fplbn4go2oh9yik6jug4.jpg}
134	Кухня СТАР (ПЕРВАЯ_МЕБЕЛЬНАЯ_ФАБРИКА_14147) - купить в Санкт-Петербурге	\N	142600.00	https://mebelcity.ru/catalog/kukhni/91866-kukhnya_star/	\N	3	\N	\N	\N	\N	\N	\N	\N	2025-05-08 22:26:21.17013	2025-05-08 22:26:21.17013	{https://mebelcity.ru/upload/resize_cache/iblock/26b/904_476_1/almbzsbexjiu4lb4mg5j0bpcn3wascgg.jpg}	{full/94927636_almbzsbexjiu4lb4mg5j0bpcn3wascgg.jpg}
135	Кухня СТРАДА (ПЕРВАЯ_МЕБЕЛЬНАЯ_ФАБРИКА_14149) - купить в Санкт-Петербурге	\N	218610.00	https://mebelcity.ru/catalog/kukhni/91867-kukhnya_strada/	\N	3	\N	\N	\N	\N	\N	\N	\N	2025-05-08 22:26:22.230094	2025-05-08 22:26:22.230094	{https://mebelcity.ru/upload/resize_cache/iblock/e34/904_476_1/ft8k99wwmoga3a0yueb1hwj9tom90r5f.jpg}	{full/26810794_ft8k99wwmoga3a0yueb1hwj9tom90r5f.jpg}
136	Кухня ЭТЕРНО (ПЕРВАЯ_МЕБЕЛЬНАЯ_ФАБРИКА_14161) - купить в Санкт-Петербурге	\N	603300.00	https://mebelcity.ru/catalog/kukhni/91870-kukhnya_eterno/	\N	3	\N	\N	\N	\N	\N	\N	\N	2025-05-08 22:26:23.637486	2025-05-08 22:26:23.637486	{https://mebelcity.ru/upload/resize_cache/iblock/5f7/904_476_1/9ivst2ov7919lmva9s70np2i0vmi480z.jpg}	{full/60669697_9ivst2ov7919lmva9s70np2i0vmi480z.jpg}
137	Кухня МОДЕНА (ПЕРВАЯ_МЕБЕЛЬНАЯ_ФАБРИКА_14163) - купить в Санкт-Петербурге	\N	344900.00	https://mebelcity.ru/catalog/kukhni/91871-kukhnya_modena/	\N	3	\N	\N	\N	\N	\N	\N	\N	2025-05-08 22:26:24.788029	2025-05-08 22:26:24.788029	{https://mebelcity.ru/upload/resize_cache/iblock/5a4/904_476_1/murij4japzuwu2qnl9e9ga1uwd0kdice.jpg}	{full/12512715_murij4japzuwu2qnl9e9ga1uwd0kdice.jpg}
138	Кухня ФРЕСКО (ПЕРВАЯ_МЕБЕЛЬНАЯ_ФАБРИКА_17494) - купить в Санкт-Петербурге	\N	107280.00	https://mebelcity.ru/catalog/kukhni/91872-kukhnya_fresko/	\N	3	\N	\N	\N	\N	\N	\N	\N	2025-05-08 22:26:25.877261	2025-05-08 22:26:25.877261	{https://mebelcity.ru/upload/resize_cache/iblock/95b/904_476_1/br3vnrjbx0zeytlz3rpdgzju36ctpohc.jpg}	{full/76227642_br3vnrjbx0zeytlz3rpdgzju36ctpohc.jpg}
139	Кухня РИТМО (ПЕРВАЯ_МЕБЕЛЬНАЯ_ФАБРИКА_32324) - купить в Санкт-Петербурге	\N	271440.00	https://mebelcity.ru/catalog/kukhni/91873-kukhnya_ritmo/	\N	3	\N	\N	\N	\N	\N	\N	\N	2025-05-08 22:26:26.86564	2025-05-08 22:26:26.86564	{https://mebelcity.ru/upload/resize_cache/iblock/889/904_476_1/4fxnrd6r9eh1ell0bn7tj8yqkmi35hfs.jpg}	{full/84696413_4fxnrd6r9eh1ell0bn7tj8yqkmi35hfs.jpg}
140	Кухня СФУМАТО (ПЕРВАЯ_МЕБЕЛЬНАЯ_ФАБРИКА_32602) - купить в Санкт-Петербурге	\N	164060.00	https://mebelcity.ru/catalog/kukhni/91874-kukhnya_sfumato/	\N	3	\N	\N	\N	\N	\N	\N	\N	2025-05-08 22:26:28.143727	2025-05-08 22:26:28.143727	{https://mebelcity.ru/upload/resize_cache/iblock/9dd/904_476_1/rc4q8kkhie1pny47ns1lrihui1417y70.jpg}	{full/75949550_rc4q8kkhie1pny47ns1lrihui1417y70.jpg}
141	Кухня КОДА (ПЕРВАЯ_МЕБЕЛЬНАЯ_ФАБРИКА_32618) - купить в Санкт-Петербурге	\N	174330.00	https://mebelcity.ru/catalog/kukhni/91875-kukhnya_koda/	\N	3	\N	\N	\N	\N	\N	\N	\N	2025-05-08 22:26:29.664743	2025-05-08 22:26:29.664743	{https://mebelcity.ru/upload/resize_cache/iblock/418/904_476_1/zphy60losidlehw7eyis42byry172jl8.jpg}	{full/42519146_zphy60losidlehw7eyis42byry172jl8.jpg}
\.


--
-- TOC entry 4938 (class 0 OID 0)
-- Dependencies: 229
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 141, true);


--
-- TOC entry 4779 (class 2606 OID 16693)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- TOC entry 4781 (class 2606 OID 16736)
-- Name: products unique_item; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT unique_item UNIQUE (original_url, shop_id);


--
-- TOC entry 4777 (class 1259 OID 16737)
-- Name: products_original_url_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX products_original_url_idx ON public.products USING btree (original_url);


--
-- TOC entry 4782 (class 2606 OID 16694)
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;


--
-- TOC entry 4783 (class 2606 OID 16699)
-- Name: products products_shop_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_shop_id_fkey FOREIGN KEY (shop_id) REFERENCES public.shops(id) ON DELETE SET NULL;


--
-- TOC entry 4936 (class 0 OID 0)
-- Dependencies: 230
-- Name: TABLE products; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.products TO developers;


-- Completed on 2025-05-09 00:14:59

--
-- PostgreSQL database dump complete
--

