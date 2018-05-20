export type Player = {
    id: number,
    name: string,
    overall: number,
    skills: {
        speed: number,
        technik: number,
        condition: number,
    }
    typ: string
};

export type PlayerRow = {
    id: number,
    name: string,
    overall: number,
    typ: string,
    skill_overall: number,
    skill_speed: number,
    skill_technik: number,
    skill_condition: number
};