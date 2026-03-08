export interface GradeDomainProps {
  id: string;
  name: string;
  order: number;
  schoolId: string;
  createAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class GradeDomain {
  private props: GradeDomainProps;

  constructor(props: GradeDomainProps) {
    this.props = props;
  }

  get id() {
    return this.props.id;
  }

  get name() {
    return this.props.name;
  }

  get order() {
    return this.props.order;
  }

  get schoolId() {
    return this.props.schoolId;
  }

  get createdAt() {
    return this.props.createAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get deletedAt() {
    return this.props.deletedAt;
  }
}
