import { Card, CardBody } from "@nextui-org/card";

type Props = {
  children: React.ReactNode;
};

const TabBody = (props: Props) => {
  return (
    <Card shadow="none" className="overflow-visible bg-transparent">
      <CardBody className="overflow-y-visible px-0">{props.children}</CardBody>
    </Card>
  );
};

export default TabBody;
