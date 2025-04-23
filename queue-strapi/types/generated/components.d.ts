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

export interface CommonSocialLInks extends Struct.ComponentSchema {
  collectionName: 'components_common_social_l_inks';
  info: {
    displayName: 'socialLInks';
  };
  attributes: {
    email: Schema.Attribute.String;
    phone: Schema.Attribute.String;
    telegram: Schema.Attribute.String;
    vk: Schema.Attribute.String;
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
    isOffByEmployee: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    isOffByStudent: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    notRegisteredUser: Schema.Attribute.Component<
      'common.not-registered-user',
      false
    >;
    student: Schema.Attribute.Relation<'oneToOne', 'api::student.student'>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'common.not-registered-user': CommonNotRegisteredUser;
      'common.social-l-inks': CommonSocialLInks;
      'recorded-students.recorded-students': RecordedStudentsRecordedStudents;
    }
  }
}
