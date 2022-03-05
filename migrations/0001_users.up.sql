CREATE TYPE user_type AS ENUM ('user', 'editor', 'admin');
CREATE TYPE user_status AS ENUM ('active', 'disabled', 'deleted');


CREATE TABLE "users" (
    "id" SERIAL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "username" TEXT NOT NULL UNIQUE,
    "password_hash" TEXT NOT NULL,
    "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    "updated" TIMESTAMP WITH TIME ZONE NULL,
    "last_login" TIMESTAMP WITH TIME ZONE NULL,
    "type" user_type NOT NULL DEFAULT 'user',
    "status" user_status NOT NULL DEFAULT 'active'
);

CREATE INDEX "users_email_idx" ON "users" ("email","status");
CREATE INDEX "users_username_idx" ON "users" ("username","status");
