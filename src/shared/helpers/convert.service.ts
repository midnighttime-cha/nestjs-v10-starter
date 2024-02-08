import { Injectable } from "@nestjs/common";
import { DatetimeService } from "./datetime.service";

@Injectable()
export class ConvertService {
    floatDecFormat(value) {
        if (!value) {
          return 0;
        }
        // const _numbers = parseFloat(`${value.toFixed(2)}`);
        const _numbers = (Math.round(value * 100) / 100).toFixed(2);
        return `${_numbers}`.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    }

    floatDecFormatNoFixed(value) {
        if (!value) {
            return 0;
        }
        let _numbers = '0.0';
        // const _numbers = parseFloat(`${value.toFixed(2)}`);
        if (`${value}`.indexOf('.') < 0) {
            _numbers = `${(Math.round(value * 100) / 100)}`;
        } else {
            _numbers = (Math.round(value * 100) / 100).toFixed(2);
        }

        return `${_numbers}`.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    }

    stringToFloat(str, decimal) {
        const n = Number(str.replace(/[^0-9-.]/g, ""));
        return parseFloat(`${n}`).toFixed(decimal ? decimal : 2);
    }

    numberToFormat(numbers: number, dec: number = 2) {
        const _numbers = (Math.round(numbers * 100) / 100).toFixed(dec); //parseFloat(`${numbers.toFixed(dec)}`);
        const formatter = new Intl.NumberFormat('th-TH', { minimumFractionDigits: dec });
        return formatter.format(parseFloat(`${_numbers}`));
    }

    stringToNumber(str) {
        return `${str}`.replace(/[^0-9-.]/g, "");
    }

    thaiNumberToText(Numbers) {
        Numbers = Numbers.replace(/๐/gi, '0');
        Numbers = Numbers.replace(/๑/gi, '1');
        Numbers = Numbers.replace(/๒/gi, '2');
        Numbers = Numbers.replace(/๓/gi, '3');
        Numbers = Numbers.replace(/๔/gi, '4');
        Numbers = Numbers.replace(/๕/gi, '5');
        Numbers = Numbers.replace(/๖/gi, '6');
        Numbers = Numbers.replace(/๗/gi, '7');
        Numbers = Numbers.replace(/๘/gi, '8');
        Numbers = Numbers.replace(/๙/gi, '9');
        return this.arabicNumberToText(Numbers);
    }

    checkNumber(Numbers) {
        let decimal = false;
        Numbers = Numbers.toString();
        Numbers = Numbers.replace(/ |,|บาท|฿/gi, '');
        for (let i = 0; i < Numbers.length; i++) {
            if (Numbers[i] == '.') {
            decimal = true;
            }
        }
        if (decimal == false) {
            Numbers = Numbers + '.00';
        }
        return Numbers
    }

    arabicNumberToText(Number) {
        let Numbers = this.checkNumber(Number);
        let NumberArray = new Array("ศูนย์", "หนึ่ง", "สอง", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า", "สิบ");
        let DigitArray = new Array("", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน");
        let BahtText = "";
        
        if (isNaN(Numbers)) {
            return "ข้อมูลนำเข้าไม่ถูกต้อง";
        } else {
            if ((Numbers - 0) > 9999999.9999) {
                return "ข้อมูลนำเข้าเกินขอบเขตที่ตั้งไว้";
            } else {
                Numbers = Numbers.split(".");
                if (Numbers[1].length > 0) {
                    Numbers[1] = Numbers[1].substring(0, 2);
                }
                const NumberLen = Numbers[0].length - 0;

                for (let i = 0; i < NumberLen; i++) {
                    const tmp = Numbers[0].substring(i, i + 1) - 0;
                    if (tmp != 0) {
                        if ((i == (NumberLen - 1)) && (tmp == 1)) {
                            BahtText += "เอ็ด";
                        } else if ((i == (NumberLen - 2)) && (tmp == 2)) {
                            BahtText += "ยี่";
                        } else if ((i == (NumberLen - 2)) && (tmp == 1)) {
                            BahtText += "";
                        } else {
                            BahtText += NumberArray[tmp];
                        }
                        BahtText += DigitArray[NumberLen - i - 1];
                    }
                }

                BahtText += "บาท";
                if ((Numbers[1] == "0") || (Numbers[1] == "00")) {
                    BahtText += "ถ้วน";
                } else {
                    let DecimalLen = Numbers[1].length - 0;
                    for (let i = 0; i < DecimalLen; i++) {
                        const tmp = Numbers[1].substring(i, i + 1) - 0;
                        if (tmp != 0) {
                            if ((i == (DecimalLen - 1)) && (tmp == 1)) {
                                BahtText += "เอ็ด";
                            } else if ((i == (DecimalLen - 2)) && (tmp == 2)) {
                                BahtText += "ยี่";
                            } else if ((i == (DecimalLen - 2)) && (tmp == 1)) {
                                BahtText += "";
                            } else {
                                BahtText += NumberArray[tmp];
                            }
                            BahtText += DigitArray[DecimalLen - i - 1];
                        }
                    }
                    BahtText += "สตางค์";
                }
                return BahtText;
            }
        }
    }
}