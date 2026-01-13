import { Dot, Info } from "lucide-react";

export default function Instructions() {
  return (
    <div className="w-full h-full border-t-4 border-teal-500 bg-teal-100 px-4 py-3 text-teal-900 shadow-md">
      <div className="flex">
        <div className="me-2 mt-1">
          <Info className="stroke-teal-500" />
        </div>

        <div>
          <p className="font-bold mb-2">Instructions</p>

          {instructions.map((inst, index) => (
            <div key={index} className="flex gap-x-1 mb-1">
              <Dot className="w-4 mt-1" />
              <p className="text-sm">{inst.info}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const instructions = [
  { info: 'Use your real photo as the profile picture.' },
  { info: "Make sure your first and last name are real." },
  { info: "Ensure your email address is correct." },
  { info: "Provide a valid phone number." },
  { info: "Set up your store logo and cover photo." },
  { info: "Specify default shipping details." },
  { info: "Include a clear return policy." },
  { info: "Double-check your store URL." },
  { info: "Enter a detailed store description." },
  { info: "Fill in shipping fee fields carefully." },
  { info: "Provide realistic delivery times." },
  { info: "Review all details before submitting." },
];
