drop schema if exists ccca cascade;

create schema ccca;

create table ccca.account (
	account_id uuid primary key,
	name text not null,
	email text not null,
	cpf text not null,
	car_plate text null,
	is_passenger boolean not null default false,
	is_driver boolean not null default false,
	password text not null
);

create table ccca.ride (
	ride_id uuid primary key,
	passenger_id uuid not null,
	driver_id uuid,
	status text not null,
	fare numeric,
	distance numeric,
	from_lat numeric,
	from_long numeric,
	to_lat numeric,
	to_long numeric,
	date timestamp without time zone
);

create table ccca.position (
	position_id uuid primary key,
	ride_id uuid,
	lat numeric,
	long numeric,
	date timestamp
);