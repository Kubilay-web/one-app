import { redirect } from "next/navigation";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import Select from "./ui/select";
import FormSubmitButton from "./FormSubmitButton";
import { MongoClient } from "mongodb";

const MONGO_URI = process.env.DATABASE_URL || "mongodb://localhost:27017";
const DB_NAME = "Jobs";

let cachedClient: MongoClient | null = null;

async function getClient() {
  if (cachedClient) return cachedClient;
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  cachedClient = client;
  return client;
}

async function filterJobs(formData: FormData) {
  "use server";
  const values = Object.fromEntries(formData.entries());
  const { q, type, city } = values as { q?: string; type?: string; city?: string };
  const searchParams = new URLSearchParams({
    ...(q && { q: q.trim() }),
    ...(type && { type }),
    ...(city && { city }),
  });
  redirect(`/apps/jobportal/?${searchParams.toString()}`);
}

export default async function JobFilterSidebar() {
  const client = await getClient();
  const db = client.db(DB_NAME);

  // Job type listesini çek
  const jobTypes = await db.collection("jobs").aggregate([
    {
      $lookup: {
        from: "jobtypes",
        localField: "jobTypeId",
        foreignField: "_id",
        as: "jobType",
      },
    },
    { $unwind: "$jobType" },
    { $group: { _id: "$jobType._id", name: { $first: "$jobType.name" } } },
    { $sort: { name: 1 } },
  ]).toArray();

  // Şehir listesini çek
  const distinctCities = await db.collection("jobs").aggregate([
    {
      $lookup: {
        from: "cities",
        localField: "cityId",
        foreignField: "_id",
        as: "cityDoc",
      },
    },
    { $unwind: "$cityDoc" },
    { $group: { _id: "$cityDoc._id", name: { $first: "$cityDoc.name" } } },
    { $sort: { name: 1 } },
  ]).toArray();

  return (
    <aside className="sticky top-0 h-fit rounded p-4 border">
      <form action={filterJobs}>
        <div className="mb-4">
          <Label htmlFor="q">Arama</Label>
          <Input id="q" name="q" placeholder="Anahtar kelime" />
        </div>

        <div className="mb-4">
          <Label htmlFor="type">İş Türü</Label>
          <Select id="type" name="type">
            <option value="">Tümü</option>
            {jobTypes.map((type: any) => (
              <option key={type._id} value={type._id}>{type.name}</option>
            ))}
          </Select>
        </div>

        <div className="mb-4">
          <Label htmlFor="city">Şehir</Label>
          <Select id="city" name="city">
            <option value="">Tümü</option>
            {distinctCities.map((city: any) => (
              <option key={city._id} value={city._id}>{city.name}</option>
            ))}
          </Select>
        </div>

        <FormSubmitButton>Filtrele</FormSubmitButton>
      </form>
    </aside>
  );
}
