import { Actions } from "./actions.js";
import { Modulos } from "./modules.js";

Actions.belongsToMany(Modulos, { through: 'ModuleActions' });
Modulos.belongsToMany(Actions, { through: 'ModuleActions' });