import Admin from "./Admin.js";
import AdminAuditLog from "./AdminAuditLogs.js";
import College from "./College.js";
import Student from "./student.js";
import StudentAuditLog from "./StudentAuditLogs.js";
import Resume from "./Resume.js";
import InterviewExchange from "./InterviewExchanges.js";
import Interview from "./Interview.js";
import InterviewToDepartment from "./InterviewToDepartments.js";
import InterviewInstance from "./InterviewInstances.js";
import Feedback from "./Feedback.js";
import Department from "./Department.js";
import EvalMetrics from "./EvalMetrics.js";

Admin.belongsTo(College, { foreignKey: "collegeId" });
Admin.hasMany(AdminAuditLog, { foreignKey: "adminId" });
AdminAuditLog.belongsTo(Admin, { foreignKey: "adminId" });

Student.belongsTo(College, { foreignKey: "collegeId" });
Student.belongsTo(Department, { foreignKey: "departmentId" });
Student.hasMany(Resume, { foreignKey: "rollNumber" });
Student.hasMany(InterviewInstance, { foreignKey: "rollNumber" });
Student.hasMany(StudentAuditLog, { foreignKey: "rollNumber" });
Student.hasMany(EvalMetrics, { foreignKey: "rollNumber" });
Student.hasMany(Feedback, { foreignKey: "rollNumber" });
StudentAuditLog.belongsTo(Student, { foreignKey: "rollNumber" });

Resume.belongsTo(Student, { foreignKey: "rollNumber" });

EvalMetrics.belongsTo(Student, { foreignKey: "rollNumber" });

College.hasMany(Interview, { foreignKey: "collageId" });
College.hasMany(Admin, { foreignKey: "collegeId" });
College.hasMany(Student, { foreignKey: "collegeId" });
College.hasMany(Department, { foreignKey: "collegeId" });

Department.hasMany(Student, { foreignKey: "departmentId" });
Department.hasMany(InterviewToDepartment, { foreignKey: "departmentId" });
Department.belongsTo(College, { foreignKey: "collegeId" });

Interview.hasMany(InterviewInstance, { foreignKey: "interviewId" });
Interview.hasMany(InterviewToDepartment, { foreignKey: "interviewId" });
Interview.hasMany(InterviewInstance, { foreignKey: "interviewId" });
Interview.hasMany(Feedback, { foreignKey: "interviewId" });
Interview.belongsTo(College, { foreignKey: "collageId" });

InterviewExchange.belongsTo(InterviewInstance, { foreignKey: "interviewInstanceId" });

InterviewInstance.hasMany(InterviewExchange, { foreignKey: "interviewInstanceId" });
InterviewInstance.belongsTo(Interview, { foreignKey: "interviewId" });

InterviewToDepartment.belongsTo(Interview, { foreignKey: "interviewId" });
InterviewToDepartment.belongsTo(College, { foreignKey: "departmentId" });
InterviewToDepartment.belongsTo(Department, { foreignKey: "departmentId" });

Feedback.belongsTo(Interview, { foreignKey: "interviewId" });
Feedback.belongsTo(Student, { foreignKey: "rollNumber" });