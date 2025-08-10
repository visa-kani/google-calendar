const Config = {
    develop: {
        API: `https://pokeapi.co/api/v2/`,
    }
};
const environment = "develop";

export const hostConfig = {
    API: Config[environment].API
}