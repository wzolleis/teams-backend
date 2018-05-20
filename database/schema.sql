CREATE TABLE player (
  id              SERIAL primary key,
  name            varchar(100),
  overall         int,
  typ             varchar(100),
  skill_speed     integer default 50,
  skill_technik   integer default 50,
  skill_condition integer default 50
);