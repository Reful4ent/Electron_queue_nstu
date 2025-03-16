import type { Schema, Struct } from '@strapi/strapi';

export interface RecordedStudentsRecordedStudents
  extends Struct.ComponentSchema {
  collectionName: 'components_recorded_students_recorded_students';
  info: {
    description: '';
    displayName: 'recordedStudents';
  };
  attributes: {
    dateEndConsultation: Schema.Attribute.DateTime;
    dateStartConsultation: Schema.Attribute.DateTime;
    student: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::users-permissions.user'
    >;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'recorded-students.recorded-students': RecordedStudentsRecordedStudents;
    }
  }
}
