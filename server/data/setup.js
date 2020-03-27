import fetch from './fetcher/fetcher';
import load from './loader/loader';

export default async function setup() {
    await fetch();
    await load();
}
