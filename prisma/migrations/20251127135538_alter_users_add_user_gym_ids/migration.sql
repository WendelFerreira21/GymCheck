ALTER TABLE "check_ins" ADD COLUMN "user_id" TEXT NOT NULL;
ALTER TABLE "check_ins" ADD COLUMN "gym_id" TEXT NOT NULL;

ALTER TABLE "check_ins"
  ADD CONSTRAINT "check_ins_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id");

ALTER TABLE "check_ins"
  ADD CONSTRAINT "check_ins_gym_id_fkey"
  FOREIGN KEY ("gym_id") REFERENCES "gyms"("id");