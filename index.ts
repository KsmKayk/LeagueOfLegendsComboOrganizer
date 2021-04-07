import fs from "fs";
import path from "path";

interface Account {
  user: string;
  pass: string;
  country: string;
  nickname: string;
  region: string;
}

const comboPath = path.resolve(__dirname, "combo.txt");
const combo = fs.readFileSync(comboPath).toString();
const separator = "[-------------------------------------]";

async function start(): Promise<void> {
  const splitedCombo = splitCombo(combo, separator);
  const trimmedCombo = trimCombo(splitedCombo);
  const accounts = getFieldsFromCombo(trimmedCombo);
  //console.log();
  const filteredAccounts = filterAccounts(accounts);
  const joinedUserAndPass = joinUserAndPass(filteredAccounts);
  await createFilteredComboFile(joinedUserAndPass);
}

function splitCombo(combo: string, separator: string) {
  return combo.split(separator);
}

function trimCombo(combo: Array<string>): Array<string> {
  let trimmedCombo: Array<string> = [];
  combo.map((data: string, idx: number) => {
    let trimmedData = data.trim();
    trimmedCombo.push(trimmedData);
  });
  return trimmedCombo;
}

function getFieldsFromCombo(combo: Array<string>) {
  return combo.map((data, idx) => {
    //console.log(`antes`, data, `depois`);
    let splitedData = data.split(/\r?\n/);
    //console.log(splitedData[0].split(":"));
    let account = {
      user: "",
      pass: "",
      country: "",
      nickname: "",
      region: "",
    };

    account.user = splitedData[0].split(":")[1];
    account.pass = splitedData[0].split(":")[2];
    account.country = splitedData[1].split(":")[1];
    account.nickname = splitedData[2].split(":")[1];
    account.region = splitedData[3].split(":")[1];

    return account;
  });
}

function filterAccounts(accounts: Array<Account>) {
  return accounts.filter((account) => account.region.trim() === "BR");
}

function joinUserAndPass(accounts: Array<Account>) {
  let response = accounts.map((account) => {
    let userPass = `${account.user}:${account.pass}`;
    return userPass;
  });

  return response.join("\r\n");
}

async function createFilteredComboFile(accounts: string): Promise<void> {
  fs.writeFile("filteredCombo.txt", accounts, function (err: Error) {
    if (err) return console.log(err);
  });
}

start();
