import { SolrDriver } from './solrDriver.mjs';

let solr = new SolrDriver();

await solr.syncDocuments('D:\\owncloud.date-yakkyoku.net\\ノート');

