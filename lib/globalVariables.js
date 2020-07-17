const log = require("@ui5/logger").getLogger("server:customMiddleware:globalVariables");
const dotenv = require("dotenv");

dotenv.config();

// get all environment variables
const envVariables = process.env;
let globalVariables = [];

// loop through env variables to find keys which are having prefix 'UI5_GLOBAL_VAR'
if (typeof envVariables === "object") {
    for (let key in envVariables) {
        // env variable should start with 'UI5_GLOBAL_VAR' and should in format 'UI5_GLOBAL_VAR.placeholder'
        if (/^UI5_GLOBAL_VAR__(.+)$/i.test(key)) {
            let placeholderString = /^UI5_GLOBAL_VAR__(.+)$/i.exec(key)[1];
            globalVariables.push({
                placeholder: placeholderString,
                value: envVariables[key]
            });
        }
    }
}
/**
 * UI5 Server middleware to inject variables from .env file into a global object
 *
 * @param {Object} parameters Parameters
 * @param {Object} parameters.resources Resource collections
 * @param {module:@ui5/fs.AbstractReader} parameters.resources.all Reader or Collection to read resources of the
 *                                        root project and its dependencies
 * @param {module:@ui5/fs.AbstractReader} parameters.resources.rootProject Reader or Collection to read resources of
 *                                        the project the server is started in
 * @param {module:@ui5/fs.AbstractReader} parameters.resources.dependencies Reader or Collection to read resources of
 *                                        the projects dependencies
 * @param {Object} parameters.options Options
 * @param {string} [parameters.options.configuration] Custom server middleware configuration if given in ui5.yaml
 * @returns {function} Middleware function to use
 */
module.exports = ({ resources, options }) => {
    const { debug = false } = options.configuration || {};

    return async (req, res, next) => {
        if (!globalVariables.length) {
            next();
            return;
        }
        if (req.path.endsWith("ui5-global-vars.js")) {
            let globalVariablesScript = "(function(){\n  $ui5GlobalVariables = {\n     _globalVariables: {\n";
            for (let variable of globalVariables) {
                globalVariablesScript += `       "${variable.placeholder}": "${variable.value}",\n`;
            }
            globalVariablesScript +=
                "     },\n     get: function(variableId) {\n       return this._globalVariables[variableId];\n     }\n  }\n})()";

            if (debug) {
                log.info(`Created Global Variable Script with ${globalVariables.length} global variables`);
            }
            res.type(".js");
            res.end(globalVariablesScript);
        } else {
            next();
        }
    };
};
