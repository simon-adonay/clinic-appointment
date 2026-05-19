import { format } from "date-fns";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { PatientForm } from "@/components/forms/patient-form";
import { Card } from "@/components/ui/card";

export default async function PatientsPage() {
  const session = await auth();
  const clinicId = session?.user.clinicId;
  if (!clinicId) return null;

  const patients = await prisma.patient.findMany({
    where: { clinicId },
    orderBy: [{ updatedAt: "desc" }],
    take: 50
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-ink">Patients</h1>
        <p className="mt-1 text-sm text-slate-600">Manage patient contact details, birth dates, and care notes.</p>
      </div>
      <Card className="p-5">
        <h2 className="mb-4 text-lg font-bold text-ink">Add patient</h2>
        <PatientForm />
      </Card>
      <Card className="overflow-hidden">
        <div className="border-b border-slate-100 p-5">
          <h2 className="text-lg font-bold text-ink">Patient directory</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Contact</th>
                <th className="px-5 py-3">DOB</th>
                <th className="px-5 py-3">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td className="px-5 py-4 font-semibold text-ink">
                    {patient.firstName} {patient.lastName}
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {patient.email || patient.phone || <span className="text-slate-400">No contact</span>}
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {patient.dateOfBirth ? format(patient.dateOfBirth, "MMM d, yyyy") : "Not set"}
                  </td>
                  <td className="px-5 py-4 text-slate-500">{format(patient.updatedAt, "MMM d")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
