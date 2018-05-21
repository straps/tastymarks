CREATE FUNCTION public.fn_concat_pipe(text, text) RETURNS text
    LANGUAGE sql
    AS $_$
    SELECT CASE WHEN $1 IS NULL OR $1 = '' THEN $2
            WHEN $2 IS NULL OR $2 = '' THEN $1
            ELSE $1 || '|' || $2
            END;
$_$;
CREATE AGGREGATE public.concat_pipe(text) (
    SFUNC = public.fn_concat_pipe,
    STYPE = text,
    INITCOND = ''
);

CREATE TABLE public.bookmarks (
    id integer NOT NULL,
    url character varying(501),
    title character varying(501),
    notes text,
    userid integer,
    created timestamp with time zone DEFAULT now(),
    modified timestamp with time zone DEFAULT now()
);
CREATE SEQUENCE public.bookmarks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.bookmarks_id_seq OWNED BY public.bookmarks.id;

CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);

CREATE TABLE public.tags (
    bookmarkid integer NOT NULL,
    tag character varying(51) NOT NULL
);

CREATE TABLE public.tagsubs (
    userid integer NOT NULL,
    tag character varying(51) NOT NULL
);
COMMENT ON TABLE public.tagsubs IS 'Tag subscriptions';

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(250),
    email character varying(250),
    gender character varying(10),
    locale character varying(20)
);
CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;

CREATE TABLE public.usersubs (
    userid integer NOT NULL,
    targetuserid integer NOT NULL
);
COMMENT ON TABLE public.usersubs IS 'User subscriptions';
COMMENT ON COLUMN public.usersubs.userid IS 'User observing';
COMMENT ON COLUMN public.usersubs.targetuserid IS 'Target/Observed user id';

ALTER TABLE ONLY public.bookmarks ALTER COLUMN id SET DEFAULT nextval('public.bookmarks_id_seq'::regclass);
ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);
ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (bookmarkid, tag);
ALTER TABLE ONLY public.tagsubs
    ADD CONSTRAINT tagsubs_pkey PRIMARY KEY (userid, tag);
ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT uk_bookmarks_url_userid UNIQUE (url, userid);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT uk_users_email UNIQUE (email);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.usersubs
    ADD CONSTRAINT usersubs_pkey PRIMARY KEY (userid, targetuserid);
ALTER TABLE ONLY public.tags
    ADD CONSTRAINT ext_bookmarkid_bookmarks_id FOREIGN KEY (bookmarkid) REFERENCES public.bookmarks(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.tagsubs
    ADD CONSTRAINT ext_tagsubs_observerid FOREIGN KEY (userid) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT ext_userid_user_id FOREIGN KEY (userid) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.usersubs
    ADD CONSTRAINT ext_usersubs_observerid FOREIGN KEY (userid) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.usersubs
    ADD CONSTRAINT ext_usersubs_targetid FOREIGN KEY (targetuserid) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
