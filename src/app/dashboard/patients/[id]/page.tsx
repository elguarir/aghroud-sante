import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { redirect } from "next/navigation";
import PatientForm from "../_components/patient-form";
import { getPatientById } from "@/server/api/routers/patient.helpers";
import Wrapper from "../../_components/wrapper";
import DeletePatientAction from "../_components/delete-patient-action";

type Props = {
  params: {
    id: number;
  };
  searchParams: {
    action?: string;
  };
};

const DeletePatientPage = async (props: Props) => {
  const { params, searchParams } = props;
  if (!params.id) {
    return redirect("/dashboard/patients");
  }

  const patient = await getPatientById(params.id);

  if (!patient) {
    return redirect("/dashboard/patients");
  }

  return (
    <Wrapper className="flex w-full items-center justify-center">
      <div className="mx-auto w-full max-w-lg px-2">
        <Card shadow="md" className="w-full">
          <CardHeader className="flex flex-col items-start space-y-1 p-6">
            <h3 className="text-large font-semibold leading-none tracking-tight">
              {searchParams.action === "delete" ? (
                <>
                  Supprimer le patient{' '}
                  <span className="text-primary">
                    {patient.firstName} {patient.lastName}
                  </span>
                  ?
                </>
              ) : (
                "Modfier les informations du patient"
              )}
            </h3>
            <p className="text-small text-default-500">
              {searchParams.action === "delete"
                ? "Êtes-vous sûr de vouloir supprimer ce patient, cette action ne peut pas être annulée et toutes les données du patient seront perdues."
                : "Modifiez les informations du patient ci-dessous, puis cliquez sur Enregistrer pour enregistrer les modifications."}
            </p>
          </CardHeader>
          <CardBody className="p-6 pt-1">
            <div className="flex flex-col gap-6">
              {searchParams.action === "delete" ? (
                <>
                  <DeletePatientAction id={patient.id} />
                </>
              ) : (
                <>
                  <div className="flex w-full items-center justify-end gap-4">
                    <PatientForm mode="edit" patientId={patient.id} />
                  </div>
                </>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </Wrapper>
  );
};

export default DeletePatientPage;
