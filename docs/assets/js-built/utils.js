var Files;
(function (Files) {
    Files[Files["A"] = 1] = "A";
    Files[Files["B"] = 2] = "B";
    Files[Files["C"] = 3] = "C";
    Files[Files["D"] = 4] = "D";
    Files[Files["E"] = 5] = "E";
    Files[Files["F"] = 6] = "F";
    Files[Files["G"] = 7] = "G";
    Files[Files["H"] = 8] = "H";
    Files[Files["NONE"] = 9] = "NONE";
})(Files || (Files = {}));
var Ranks;
(function (Ranks) {
    Ranks[Ranks["ONE"] = 1] = "ONE";
    Ranks[Ranks["TWO"] = 2] = "TWO";
    Ranks[Ranks["THREE"] = 3] = "THREE";
    Ranks[Ranks["FOUR"] = 4] = "FOUR";
    Ranks[Ranks["FIVE"] = 5] = "FIVE";
    Ranks[Ranks["SIX"] = 6] = "SIX";
    Ranks[Ranks["SEVEN"] = 7] = "SEVEN";
    Ranks[Ranks["EIGHT"] = 8] = "EIGHT";
    Ranks[Ranks["NONE"] = 9] = "NONE";
})(Ranks || (Ranks = {}));
var Colors;
(function (Colors) {
    Colors[Colors["WHITE"] = 0] = "WHITE";
    Colors[Colors["BLACK"] = 1] = "BLACK";
    Colors[Colors["NONE"] = 2] = "NONE";
})(Colors || (Colors = {}));
export { Files, Ranks };
