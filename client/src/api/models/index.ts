import UserModel from "./UserModel.ts";
import ReservationModel from "./ReservationModel.ts";
import AssetModel from "./AssetModel.ts";
import AssetOptionModel from "./AssetOptionModel.ts";
import RoleModel from "./RoleModel.ts";
import NotificationModel from "./NotificationModel.ts";
import CarModel from "./CarModel.ts";
import EmployeeModel from "./EmployeeModel.ts";
import InspectionModel from "./InspectionModel.ts";

const models = {
	asset: AssetModel,
	assetOption: AssetOptionModel,
	reservation: ReservationModel,
	car: CarModel,
	user: UserModel,
	role: RoleModel,
	notification: NotificationModel,
    employee: EmployeeModel,
    inspection: InspectionModel,
} as const;

// 🔹 This type is now the keys of the models object
type ModelName = keyof typeof models;

export const getModel =
	(name: ModelName) => {
		return models[name];
	};