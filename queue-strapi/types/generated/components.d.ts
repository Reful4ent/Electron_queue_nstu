import type { Schema, Struct } from '@strapi/strapi';

export interface CommonNotRegisteredUser extends Struct.ComponentSchema {
  collectionName: 'components_common_not_registered_users';
  info: {
    displayName: 'notRegisteredUser';
  };
  attributes: {
    name: Schema.Attribute.String;
    surname: Schema.Attribute.String;
  };
}

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
    notRegisteredUser: Schema.Attribute.Component<
      'common.not-registered-user',
      false
    >;
    student: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::users-permissions.user'
    >;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'common.not-registered-user': CommonNotRegisteredUser;
      'recorded-students.recorded-students': RecordedStudentsRecordedStudents;
    }
  }
}
