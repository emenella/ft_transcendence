export interface ResponceAccessToken {
    access_token: string;
}

export interface ResponceUserInfo {
    id: number;
    email: string;
    login: string;
    first_name: string;
    last_name: string;
    usual_full_name: string;
    usual_first_name: string;
    url: string;
    phone: string;
    displayname: string;
    image: [];
    staff?: boolean;
    correction_point: number;
    pool_month: string;
    pool_year: string;
    location: string;
    wallet: number;
    anonymize_date: string;
    data_erasured_at: string;
    alumni?: boolean;
    active?: boolean;
    groups: [];
    cursus_users: [];
    projects_users: [];
    languages_users: [];
    achievements: [];
    titles: [];
    titles_users: [];
    partnerships: [];
    pratroned: [];
    patroning: [];
    expertises_users: [];
    roles: [];
    campus: [];
    campus_users: [];
}
