import { ElasticDriver } from "models/elasticDriver.mjs";

let elasticDriver = new ElasticDriver();

let response = await elasticDriver.searchDocument("家事援助サービスについてアイディア出して");

console.log(JSON.stringify(response, null, 2));