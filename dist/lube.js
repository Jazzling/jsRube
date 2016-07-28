(function(){
"use strict";
;
var Parser = function (src, isModule) {

  this.src = src;

  this.unsatisfiedAssignment = null;
  this.unsatisfiedArg = null;
  this.unsatisfiedLabel = null;

  this.newLineBeforeLookAhead = false;

  this.ltval = null;
  this.lttype= "";
  this.ltraw = "" ;
  this.prec = 0 ;
  this.isVDT = false;

  this.labels = {};

  this.li0 = 0;
  this.col0 = 0;
  this.c0 = 0;

  this.li = 1;
  this.col = 0;
  this.c = 0;
  
  this.canBeStatement = false;
  this.foundStatement = false;
  this.scopeFlags = 0;

  this.isInArgList = false;
  this.argNames = null;

  this.tight = !!isModule ;

  this.parenYS = null;
  this.firstNonSimpArg = null;

  this.isScript = !isModule;
  this.v = 12 ;

  this.firstParen = null;
  this.firstUnassignable = null;

  this.firstElemWithYS = null;
  this.firstYS = null;
  
  this.throwReserved = !false;
 
  this.errorHandlers = {};
  this.errorHandlerOutput = null;

  this.arrowParen = false;
  this.firstEA = null;
  this.firstEAContainer = null;
  this.defaultEA = null;
  this.inComplexArgs = false;

  this.first__proto__ = false;
};

;
  
function Scope(parentScope, loop, scopeMode, catchVars) {
   if ( !parentScope )
     this.assert( scopeMode === SCOPE_FUNC );
   
   this.parentScope = parentScope || null;
   if ( scopeMode === SCOPE_CATCH ) {
     this.assert( catchVars ); 
     this.catchVars = {};
     var e = 0;
     while ( e < catchVars.length ) {
        this.catchVars[name(catchVars[e])] = !false;
        e++ ;
     }
   }
   else
     this.catchVars = null;

   this.unresolved = {};
   this.defined = {};

   if ( scopeMode === SCOPE_FUNC )
      this.surroundingFunc = this;
   
   else
      this.surroundingFunc = this.parentScope.surroundingFunc;

   this.scopeMode = scopeMode;
   this.isInALoop = loop;
}

       
;
var CHAR_1 = char2int('1'),
    CHAR_2 = char2int('2'),
    CHAR_3 = char2int('3'),
    CHAR_4 = char2int('4'),
    CHAR_5 = char2int('5'),
    CHAR_6 = char2int('6'),
    CHAR_7 = char2int('7'),
    CHAR_8 = char2int('8'),
    CHAR_9 = char2int('9'),
    CHAR_0 = char2int('0'),

    CHAR_a = char2int('a'), CHAR_A = char2int('A'),
    CHAR_b = char2int('b'), CHAR_B = char2int('B'),
    CHAR_e = char2int('e'), CHAR_E = char2int('E'),
    CHAR_g = char2int('g'),
    CHAR_f = char2int('f'), CHAR_F = char2int('F'),
    CHAR_i = char2int('i'),
    CHAR_m = char2int('m'),
    CHAR_n = char2int('n'),
    CHAR_o = char2int('o'), CHAR_O = char2int('O'),
    CHAR_r = char2int('r'),
    CHAR_t = char2int('t'),
    CHAR_u = char2int('u'), CHAR_U = char2int('U'),
    CHAR_v = char2int('v'), CHAR_X = char2int('X'),
    CHAR_x = char2int('x'),
    CHAR_y = char2int('y'),
    CHAR_z = char2int('z'), CHAR_Z = char2int('Z'),

    CHAR_UNDERLINE = char2int('_'),
    CHAR_$ = char2int('$'),

    CHAR_TAB = char2int('\t'),
    CHAR_CARRIAGE_RETURN = char2int('\r'),
    CHAR_LINE_FEED = char2int('\n'),
    CHAR_VTAB = char2int('\v'),
    CHAR_FORM_FEED   = char2int( '\f') ,

    CHAR_WHITESPACE = char2int(' '),

    CHAR_BACKTICK = char2int('`'),
    CHAR_SINGLE_QUOTE = char2int('\''),
    CHAR_MULTI_QUOTE = char2int('"'),
    CHAR_BACK_SLASH = char2int(('\\')),

    CHAR_DIV = char2int('/'),
    CHAR_MUL = char2int('*'),
    CHAR_MIN = char2int('-'),
    CHAR_ADD = char2int('+'),
    CHAR_AND = char2int('&'),
    CHAR_XOR = char2int('^'),
    CHAR_MODULO = char2int('%'),
    CHAR_OR = char2int('|'),
    CHAR_EQUALITY_SIGN = char2int('='),

    CHAR_SEMI = char2int(';'),
    CHAR_COMMA = char2int(','),
    CHAR_SINGLEDOT = char2int('.'),
    CHAR_COLON = char2int((':')),
    CHAR_QUESTION = char2int('?'),

    CHAR_EXCLAMATION = char2int('!'),
    CHAR_COMPLEMENT = char2int('~'),

    CHAR_ATSIGN = char2int('@'),

    CHAR_LPAREN = char2int('('),
    CHAR_RPAREN = char2int(')'),
    CHAR_LSQBRACKET = char2int('['),
    CHAR_RSQBRACKET = char2int(']'),
    CHAR_LCURLY = char2int('{'),
    CHAR_RCURLY = char2int('}'),
    CHAR_LESS_THAN = char2int('<'),
    CHAR_GREATER_THAN = char2int('>')
 ;

var SCOPE_BREAK       = 1;
var SCOPE_CONTINUE    = SCOPE_BREAK << 1;
var SCOPE_FUNCTION    = SCOPE_CONTINUE << 1;
var SCOPE_METH        = SCOPE_FUNCTION << 1;
var SCOPE_YIELD       = SCOPE_METH << 1;
var SCOPE_CONSTRUCTOR = SCOPE_YIELD << 1 ;

var  CONTEXT_FOR = 1,
     CONTEXT_ELEM = CONTEXT_FOR << 1 ,
     CONTEXT_NONE = 0,
     CONTEXT_PARAM = CONTEXT_ELEM << 1,
     CONTEXT_ELEM_OR_PARAM = CONTEXT_ELEM|CONTEXT_PARAM,
     CONTEXT_UNASSIGNABLE_CONTAINER = CONTEXT_PARAM << 1,
     CONTEXT_NULLABLE = CONTEXT_UNASSIGNABLE_CONTAINER << 1, 
     CONTEXT_DEFAULT = CONTEXT_NULLABLE << 1;

var INTBITLEN = (function() { var i = 0;
  while ( 0 < (1 << (i++)))
     if (i >= 512) return 8;

  return i;
}());


var D_INTBITLEN = 0, M_INTBITLEN = INTBITLEN - 1;
while ( M_INTBITLEN >> (++D_INTBITLEN) );

var PAREN = 'paren';


var ANY_ARG_LEN = -1;

var WHOLE_FUNCTION = 8;
var ARGLIST_AND_BODY_GEN = 1 ;
var ARGLIST_AND_BODY = 2;
var METH_FUNCTION = 4;
var CONSTRUCTOR_FUNCTION = 128;

var OBJ_MEM = 0;
var CLASS_MEM = 1;
var STATIC_MEM =  5;

var STRING_TYPE = typeof "string";

;
var Num,num = Num = function (c) { return (c >= CHAR_0 && c <= CHAR_9)};
function isIDHead(c) {
  return (c <= CHAR_z && c >= CHAR_a) ||
          c === CHAR_$ ||
         (c <= CHAR_Z && c >= CHAR_A) ||
          c === CHAR_UNDERLINE ||
         (IDS_[c >> D_INTBITLEN] & (1 << (c & M_INTBITLEN)));
};

function isIDBody (c) {
  return (c <= CHAR_z && c >= CHAR_a) ||
          c === CHAR_$ ||
         (c <= CHAR_Z && c >= CHAR_A) ||
          c === CHAR_UNDERLINE ||
         (c <= CHAR_9 && c >= CHAR_0) ||
         (IDC_[c >> D_INTBITLEN] & (1 << (c & M_INTBITLEN)));
};

function isHex(e) {
    return ( e >= CHAR_a && e <= CHAR_f ) ||
           ( e >= CHAR_0 && e <= CHAR_9 ) ||
           ( e >= CHAR_A && e <= CHAR_F );
}


;
// ! ~ - + typeof void delete    % ** * /    - +    << >>
// > <= < >= in instanceof   === !==    &    ^   |   ?:    =       ...

var PREC_WITH_NO_OP = 0;
var PREC_SIMP_ASSIG = PREC_WITH_NO_OP + 1  ;
var PREC_OP_ASSIG = PREC_SIMP_ASSIG + 40 ;
var PREC_COND = PREC_OP_ASSIG + 1;
var PREC_OO = -12 ;

var PREC_BOOL_OR = PREC_COND + 2;
var PREC_BOOL_AND  = PREC_BOOL_OR + 2 ;
var PREC_BIT_OR = PREC_BOOL_AND + 2 ;
var PREC_XOR = PREC_BIT_OR + 2;
var PREC_BIT_AND = PREC_XOR + 2;
var PREC_EQUAL = PREC_BIT_AND + 2;
var PREC_COMP = PREC_EQUAL + 2;
var PREC_SH = PREC_COMP + 2;
var PREC_ADD_MIN = PREC_SH + 2;
var PREC_MUL = PREC_ADD_MIN + 2;
var PREC_U = PREC_MUL + 1;

function isAssignment(prec) { return prec === PREC_SIMP_ASSIG || prec === PREC_OP_ASSIG ;  }
function isRassoc(prec) { return prec === PREC_U ; }
function isBin(prec) { return prec !== PREC_BOOL_OR && prec !== PREC_BOOL_AND ;  }
function isMMorAA(prec) { return prec < 0 ;  }
function isQuestion(prec) { return prec === PREC_COND  ; }


;

var SCOPE_FUNC = 1, SCOPE_CATCH = 2, SCOPE_LEXICAL = 0;

var REF_I = 1, REF_D = 2;

var has = Object.hasOwnProperty; 

var VAR_DEF = 1, LET_OR_CONST = 2;
     
;
var IDS_ = fromRunLenCodes([0,8472,1,21,1,3948,2],
 fromRunLenCodes([0,65,26,6,26,47,1,10,1,4,1,5,23,1,31,1,458,4,12,14,5,7,1,1,1,129,
5,1,2,2,4,1,1,6,1,1,3,1,1,1,20,1,83,1,139,8,166,1,38,2,1,7,39,72,27,5,3,45,43,35,2,
1,99,1,1,15,2,7,2,10,3,2,1,16,1,1,30,29,89,11,1,24,33,9,2,4,1,5,22,4,1,9,1,3,1,23,
25,71,21,79,54,3,1,18,1,7,10,15,16,4,8,2,2,2,22,1,7,1,1,3,4,3,1,16,1,13,2,1,3,14,2,
19,6,4,2,2,22,1,7,1,2,1,2,1,2,31,4,1,1,19,3,16,9,1,3,1,22,1,7,1,2,1,5,3,1,18,1,15,
2,23,1,11,8,2,2,2,22,1,7,1,2,1,5,3,1,30,2,1,3,15,1,17,1,1,6,3,3,1,4,3,2,1,1,1,2,3,
2,3,3,3,12,22,1,52,8,1,3,1,23,1,16,3,1,26,3,5,2,35,8,1,3,1,23,1,10,1,5,3,1,32,1,1,
2,15,2,18,8,1,3,1,41,2,1,16,1,16,3,24,6,5,18,3,24,1,9,1,1,2,7,58,48,1,2,12,7,58,2,
1,1,2,2,1,1,2,1,6,4,1,7,1,3,1,1,1,1,2,2,1,4,1,2,9,1,2,5,1,1,21,4,32,1,63,8,1,36,27,
5,115,43,20,1,16,6,4,4,3,1,3,2,7,3,4,13,12,1,17,38,1,1,5,1,2,43,1,333,1,4,2,7,1,1,
1,4,2,41,1,4,2,33,1,4,2,7,1,1,1,4,2,15,1,57,1,4,2,67,37,16,16,86,2,6,3,620,2,17,1,
26,5,75,3,11,7,13,1,4,14,18,14,18,14,13,1,3,15,52,35,1,4,1,67,88,8,41,1,1,5,70,10,
31,49,30,2,5,11,44,4,26,54,23,9,53,82,1,93,47,17,7,55,30,13,2,10,44,26,36,41,3,10,
36,107,4,1,4,3,2,9,192,64,278,2,6,2,38,2,6,2,8,1,1,1,1,1,1,1,31,2,53,1,7,1,1,3,3,1,
7,3,4,2,6,4,13,5,3,1,7,116,1,13,1,16,13,101,1,4,1,2,10,1,1,2,6,6,1,1,1,1,1,1,16,2,
4,5,5,4,1,17,41,2679,47,1,47,1,133,6,4,3,2,12,38,1,1,5,1,2,56,7,1,16,23,9,7,1,7,1,
7,1,7,1,7,1,7,1,7,1,7,550,3,25,9,7,5,2,5,4,86,4,5,1,90,1,4,5,41,3,94,17,27,53,16,512,
6582,74,20950,42,1165,67,46,2,269,3,16,10,2,20,47,16,31,2,80,39,9,2,103,2,35,2,8,63,
11,1,3,1,4,1,23,29,52,14,50,62,6,3,1,1,1,12,28,10,23,25,29,7,47,28,1,16,5,1,10,10,
5,1,41,23,3,1,8,20,23,3,1,3,50,1,1,3,2,2,5,2,1,1,1,24,3,2,11,7,3,12,6,2,6,2,6,9,7,
1,7,1,43,1,10,10,115,29,11172,12,23,4,49,8452,366,2,106,38,7,12,5,5,1,1,10,1,13,1,
5,1,1,1,2,1,2,1,108,33,363,18,64,2,54,40,12,116,5,1,135,36,26,6,26,11,89,3,6,2,6,2,
6,2,3,35,12,1,26,1,19,1,2,1,15,2,14,34,123,69,53,267,29,3,49,47,32,16,27,5,38,10,30,
2,36,4,8,1,5,42,158,98,40,8,52,156,311,9,22,10,8,152,6,2,1,1,44,1,2,3,1,2,23,10,23,
9,31,65,19,1,2,10,22,10,26,70,56,6,2,64,1,15,4,1,3,1,27,44,29,3,29,35,8,1,28,27,54,
10,22,10,19,13,18,110,73,55,51,13,51,784,53,75,45,32,25,26,36,41,35,3,1,12,48,14,4,
21,1,1,1,35,18,1,25,84,7,1,1,1,4,1,15,1,10,7,47,38,8,2,2,2,22,1,7,1,2,1,5,3,1,18,1,
12,5,286,48,20,2,1,1,184,47,41,4,36,48,20,1,59,43,85,26,390,64,31,1,448,57,1287,922,
102,111,17,196,2748,1071,4049,583,8633,569,7,31,113,30,18,48,16,4,31,21,5,19,880,69,
11,1,66,13,16480,2,3070,107,5,13,3,9,7,10,5990,85,1,71,1,2,2,1,2,2,2,4,1,12,1,1,1,
7,1,65,1,4,2,8,1,7,1,28,1,4,1,5,1,1,3,7,1,340,2,25,1,25,1,31,1,25,1,31,1,25,1,31,1,
25,1,31,1,25,1,8,4148,197,1339,4,1,27,1,2,1,1,2,1,1,10,1,4,1,1,1,1,6,1,4,1,1,1,1,1,
1,3,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,4,1,7,1,4,1,4,1,1,1,10,1,17,5,3,1,5,1,17,
4420,42711,41,4149,11,222,2,5762,10590,542]));

var IDC_ = fromRunLenCodes([0,183,1,719,1,4065,9,1640,1],fromRunLenCodes ( ( [ 0 ,
48,10,7,26,4,1,1,26,47,1,10,1,1,1,2,1,5,23,1,31,1,458,4,12,14,5,7,1,1,1,17,117,1,2,
2,4,1,1,6,5,1,1,1,20,1,83,1,139,1,5,2,166,1,38,2,1,7,39,9,45,1,1,1,2,1,2,1,1,8,27,
5,3,29,11,5,74,4,102,1,8,2,10,1,19,2,1,16,59,2,101,14,54,4,1,5,46,18,28,68,21,46,129,
2,10,1,19,1,8,2,2,2,22,1,7,1,1,3,4,2,9,2,2,2,4,8,1,4,2,1,5,2,12,15,3,1,6,4,2,2,22,
1,7,1,2,1,2,1,2,2,1,1,5,4,2,2,3,3,1,7,4,1,1,7,16,11,3,1,9,1,3,1,22,1,7,1,2,1,5,2,10,
1,3,1,3,2,1,15,4,2,10,9,1,7,3,1,8,2,2,2,22,1,7,1,2,1,5,2,9,2,2,2,3,8,2,4,2,1,5,2,10,
1,1,16,2,1,6,3,3,1,4,3,2,1,1,1,2,3,2,3,3,3,12,4,5,3,3,1,4,2,1,6,1,14,10,16,4,1,8,1,
3,1,23,1,16,3,8,1,3,1,4,7,2,1,3,5,4,2,10,17,3,1,8,1,3,1,23,1,10,1,5,2,9,1,3,1,4,7,
2,7,1,1,4,2,10,1,2,14,3,1,8,1,3,1,41,2,8,1,3,1,5,8,1,7,5,2,10,10,6,2,2,1,18,3,24,1,
9,1,1,2,7,3,1,4,6,1,1,1,8,6,10,2,2,13,58,5,15,1,10,39,2,1,1,2,2,1,1,2,1,6,4,1,7,1,
3,1,1,1,1,2,2,1,13,1,3,2,5,1,1,1,6,2,10,2,4,32,1,23,2,6,10,11,1,1,1,1,1,4,10,1,36,
4,20,1,18,1,36,9,1,57,74,6,78,2,38,1,1,5,1,2,43,1,333,1,4,2,7,1,1,1,4,2,41,1,4,2,33,
1,4,2,7,1,1,1,4,2,15,1,57,1,4,2,67,2,3,9,9,14,16,16,86,2,6,3,620,2,17,1,26,5,75,3,
11,7,13,1,7,11,21,11,20,12,13,1,3,1,2,12,84,3,1,4,2,2,10,33,3,2,10,6,88,8,43,5,70,
10,31,1,12,4,12,10,40,2,5,11,44,4,26,6,11,37,28,4,63,1,29,2,11,6,10,13,1,8,14,66,76,
4,10,17,9,12,116,12,56,8,10,3,49,82,3,1,35,1,2,6,246,6,282,2,6,2,38,2,6,2,8,1,1,1,
1,1,1,1,31,2,53,1,7,1,1,3,3,1,7,3,4,2,6,4,13,5,3,1,7,66,2,19,1,28,1,13,1,16,13,51,
13,4,1,3,12,17,1,4,1,2,10,1,1,2,6,6,1,1,1,1,1,1,16,2,4,5,5,4,1,17,41,2679,47,1,47,
1,133,6,9,12,38,1,1,5,1,2,56,7,1,15,24,9,7,1,7,1,7,1,7,1,7,1,7,1,7,1,7,1,32,517,3,
25,15,1,5,2,5,4,86,2,7,1,90,1,4,5,41,3,94,17,27,53,16,512,6582,74,20950,42,1165,67,
46,2,269,3,28,20,48,4,10,1,115,37,9,2,103,2,35,2,8,63,49,24,52,12,69,11,10,6,24,3,
1,1,1,2,46,2,36,12,29,3,65,14,11,6,31,1,55,9,14,2,10,6,23,3,73,24,3,2,16,2,5,10,6,
2,6,2,6,9,7,1,7,1,43,1,10,10,123,1,2,2,10,6,11172,12,23,4,49,8452,366,2,106,38,7,12,
5,5,12,1,13,1,5,1,1,1,2,1,2,1,108,33,363,18,64,2,54,40,12,4,16,16,16,3,2,24,3,32,5,
1,135,19,10,7,26,4,1,1,26,11,89,3,6,2,6,2,6,2,3,35,12,1,26,1,19,1,2,1,15,2,14,34,123,
69,53,136,1,130,29,3,49,15,1,31,32,16,27,5,43,5,30,2,36,4,8,1,5,42,158,2,10,86,40,
8,52,156,311,9,22,10,8,152,6,2,1,1,44,1,2,3,1,2,23,10,23,9,31,65,19,1,2,10,22,10,26,
70,56,6,2,64,4,1,2,5,8,1,3,1,27,4,3,4,1,32,29,3,29,35,8,1,30,25,54,10,22,10,19,13,
18,110,73,55,51,13,51,781,71,31,10,15,60,21,25,7,10,6,53,1,10,16,36,2,1,9,69,5,3,3,
11,1,1,35,18,1,37,72,7,1,1,1,4,1,15,1,10,7,59,5,10,6,4,1,8,2,2,2,22,1,7,1,2,1,5,2,
9,2,2,2,3,2,1,6,1,5,7,2,7,3,5,267,70,1,1,8,10,166,54,2,9,23,6,34,65,3,1,11,10,38,56,
8,10,54,26,3,15,4,10,358,74,21,1,448,57,1287,922,102,111,17,196,2748,1071,4049,583,
8633,569,7,31,1,10,102,30,2,5,11,55,9,4,12,10,9,21,5,19,880,69,11,47,16,17,16480,2,
3070,107,5,13,3,9,7,10,3,2,5318,5,3,6,8,8,2,7,30,4,148,3,443,85,1,71,1,2,2,1,2,2,2,
4,1,12,1,1,1,7,1,65,1,4,2,8,1,7,1,28,1,4,1,5,1,1,3,7,1,340,2,25,1,25,1,31,1,25,1,31,
1,25,1,31,1,25,1,31,1,25,1,8,2,50,512,55,4,50,8,1,14,1,22,5,1,15,3408,197,11,7,1321,
4,1,27,1,2,1,1,2,1,1,10,1,4,1,1,1,1,6,1,4,1,1,1,1,1,1,3,1,2,1,1,2,1,1,1,1,1,1,1,1,
1,1,2,1,1,2,4,1,7,1,4,1,4,1,1,1,10,1,17,5,3,1,5,1,17,4420,42711,41,4149,11,222,2,5762,
10590,542,722658,240 ]) ) )  ;

function set(bits, i) {
  bits[i>>D_INTBITLEN] |= ( 1 << ( i & M_INTBITLEN ) );

}

set(IDC_,0x200C);
set(IDC_,0x200D);


;

function char2int(c) { return c.charCodeAt(0); }
var hexD = [ '1', '2', '3', '4', '5',
             '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f' ];
hexD = ['0'].concat(hexD);

function hex(number) {
  var str = "";
  str = hexD[number&0xf] + str
  str = hexD[(number>>=4)&0xf] + str ;
  str = hexD[(number>>=4)&0xf] + str ;
  str = hexD[(number>>=4)&0xf] + str ;
  
  return str;
}

function fromRunLenCodes(runLenArray, bitm) {
  bitm = bitm || [];
  var bit = runLenArray[0];
  var runLenIdx = 1, bitIdx = 0;
  var runLen = 0;
  while (runLenIdx < runLenArray.length) {
    runLen = runLenArray[runLenIdx];
    while (runLen--) {
      while ((INTBITLEN * (bitm.length)) < bitIdx) bitm.push(0);
      if (bit) bitm[bitIdx >> D_INTBITLEN] |= (1 << (M_INTBITLEN & bitIdx));
      bitIdx++ ;
    }
    runLenIdx++ ;
    bit ^= 1;
  }
  return (bitm);
}

function arguments_or_eval(l) {
  switch ( l ) {
     case 'arguments':
     case 'eval':
       return !false;
  }

  return false;
};

var has   = Object.prototype.hasOwnProperty;

function fromcode(codePoint )  {
  if ( codePoint <= 0xFFFF)
    return String.fromCharCode(codePoint) ;

  return String.fromCharCode(((codePoint-0x10000 )>>10)+0x0D800,
                             ((codePoint-0x10000 )&(1024-1))+0x0DC00);

}

function core(n) { return n.type === PAREN ? n.expr : n; };

function toNum (n) {
  return (n >= CHAR_0 && n <= CHAR_9) ? n - CHAR_0 :
         (n <= CHAR_f && n >= CHAR_a) ? 10 + n - CHAR_a :
         (n >= CHAR_A && n <= CHAR_F) ? 10 + n - CHAR_A : -1;
};


;
 (function(){
       var i = 0;
       while(i < this.length){
          var def = this[i++];
          if ( !def ) continue;
          var e = 0;
          while ( e < def[1].length )
             def[1][e++].call(def[0]);
       }
     }).call([
[Parser.prototype, [function(){
this.parseArrayExpression = function (context ) {
  var startc = this.c - 1,
      startLoc = this.locOn(1);
  var elem = null,
      list = [];

  this.next () ;

  if ( context & CONTEXT_UNASSIGNABLE_CONTAINER )
      context = (context & CONTEXT_PARAM)|CONTEXT_NULLABLE;

  else
      context = (context & CONTEXT_PARAM)|CONTEXT_NULLABLE|CONTEXT_ELEM;

  var firstEA = null,
      firstElemWithYS = null,
      firstUnassignable = null,
      parenYS = null,
      firstParen = null,
      unsatisfiedAssignment = null,
      firstYS = this.firstYS;

  do {
     this.firstUnassignable =
     this.firstParen = 
     this.unsatisfiedAssignment = 
     this.firstEA = 
     this.firstElemWithYS = null;

     elem = this.parseNonSeqExpr (PREC_WITH_NO_OP, context );
     if ( !elem && this.lttype === '...' )
         elem = this.parseSpreadElement();

     if ( !unsatisfiedAssignment && this.unsatisfiedAssignment ) {
           this.assert ( context & CONTEXT_ELEM );
           unsatisfiedAssignment =  this.unsatisfiedAssignment;
     }
 
     if ( !firstParen && this.firstParen )
           firstParen =  this.firstParen ;

     if ( !firstUnassignable && this.firstUnassignable )
           firstUnassignable =  this.firstUnassignable ;

     if ( !firstEA && this.firstEA )
           firstEA =  this.firstEA ;

     if ( context & CONTEXT_PARAM) {
        if ( !firstElemWithYS && this.firstElemWithYS ) {
              firstElemWithYS =  this.firstElemWithYS;
              parenYS = this.parenYS;
        }
     }

     if ( !firstYS && this.firstYS ) firstYS = this.firstYS;

     if ( this.lttype === ',' ) { 
        list.push(elem) ;
        this.next();
     }
     else  {
        if ( elem ) list.push(elem);
        break ;
     }
 
  } while ( !false );

  if ( firstParen ) this.firstParen = firstParen ;
  if ( firstUnassignable ) this.firstUnassignable = firstUnassignable;
  if ( firstEA ) this.firstEA = firstEA;
  if ( unsatisfiedAssignment ) this.unsatisfiedAssignment = unsatisfiedAssignment;
  if ( firstElemWithYS ) {
     this.firstElemWithYS = firstElemWithYS;
     this.parenYS = parenYS;
  } 
  this.firstYS = firstYS;

  elem = { type: 'ArrayExpression', loc: { start: startLoc, end: this.loc() },
           start: startc, end: this.c, elements : list};

  this. expectType ( ']' ) ;

  return elem;
};

this . parseSpreadElement = function() {
  var startc = this.c-1-2,
      startLoc = this.locOn(1+2);
  this.next ();
  
  var e = this.parseNonSeqExpr(PREC_WITH_NO_OP,CONTEXT_NONE );
  return { type: 'SpreadElement',
          loc: { start: startLoc, end: e.loc.end },
          start: startc,
           end: e.end,
          argument: core(e) };
};



},
function(){
this .asArrowFuncArgList = function(head) {
   if ( head === null )
     return;

   if ( head.type === 'SequenceExpression' ) {
         this.assert(head !== this.firstParen );
         var i = 0, list = head.expressions;
         while ( i < list.length ) {
           this.asArrowFuncArg(list[i]);
           i++;
         }
   }
   else
      this.asArrowFuncArg(head);
};

this. asArrowFuncArg = function(arg  ) {
    var i = 0, list = null;

    switch  ( arg.type ) {
        case 'Identifier':
           this.assert(arg !== this.firstParen )  ;
           return this.addArg(arg);

        case 'ArrayExpression':
           this.assert(arg !== this.firstParen )  ;
           list = arg.elements;
           while ( i < list.length ) {
              if ( list[i] ) {
                 this.asArrowFuncArg(list[i]);
                 if ( list[i].type === 'SpreadElement' ) {
                    i++;
                    break;
                 }
              }
              i++;
           }
           this.assert( i === list.length );
           arg.type = 'ArrayPattern';
           return;

        case 'AssignmentExpression':
           this.assert(arg !== this.firstParen );
           this.assert(arg.operator === '=' ) ;
           this.asArrowFuncArg(arg.left);
           this.assert( arg !== this.firstElemWithYS );
           arg.type = 'AssignmentPattern';
           delete arg.operator ;
           return;

        case 'ObjectExpression':
           this.assert(arg !== this.firstParen    );
           list = arg.properties;
           while ( i < list.length )
              this.asArrowFuncArg(list[i++].value );

           arg.type = 'ObjectPattern';
           return;

        case 'AssignmentPattern':
           this.assert(arg !== this.firstParen );
           this.assert( arg !== this.firstElemWithYS );
           this.asArrowFuncArg(arg.left) ;
           return;

        case 'ArrayPattern' :
           list = arg.elements;
           while ( i < list.length )
             this.asArrowFuncArg(list[i++] ) ;

           return;

        case 'SpreadElement':
            this.asArrowFuncArg(arg.argument);
            arg.type = 'RestElement';
            return;

        case 'RestElement':
            this.asArrowFuncArg(arg.argument);
            return;

        case 'ObjectPattern':
            list = arg.properties;
            while ( i < list.length )
               this.asArrowFuncArgList ( list[i++].value  );

            return;

        default:
           this.assert(false ) ;
    }
};

this . parseArrowFunctionExpression = function(arg,context)   {

  if ( this.unsatisfiedArg )
       this.unsatisfiedArg = null;

  var prevArgNames = this.argNames;
  this.argNames = {};

  var tight = this.tight;

  switch ( arg.type ) {
    case 'Identifier':
       this.asArrowFuncArg(arg, 0)  ;
       break ;

    case PAREN:
       this.asArrowFuncArgList(core(arg));
       break ;

    default:
       this.assert(false);
  }

  if ( this.firstEA )
     this.firstEA = null;

  this.next();

  var scopeFlags = this.scopeFlags;
  this.scopeFlags &= ( SCOPE_FUNCTION|SCOPE_METH|SCOPE_CONSTRUCTOR) ;

  

  var isExpr = !false, nbody = null;

  if ( this.lttype === '{' ) {
       var prevLabels = this.labels, prevYS = this.firstYS;
       this.firstYS = null;
       this.labels = {};
       isExpr = false;
       nbody = this.parseFuncBody(CONTEXT_NONE);
       this.labels = prevLabels;
       this.firstYS = prevYS;
  }
  else
    nbody = this. parseNonSeqExpr(PREC_WITH_NO_OP, context) ;

  this.argNames = prevArgNames;
  this.scopeFlags = scopeFlags;

  var params = core(arg);

  this.tight = tight;

  return { type: 'ArrowFunctionExpression',
           params: params ?  params.type === 'SequenceExpression' ? params.expressions : [params] : [] ,
           start: arg.start,
           end: nbody.end,
           loc: { start: arg.loc.start, end: nbody.loc.end },
           generator: false,
           expression: isExpr,
           body: core(nbody),
           id : null
  }; 
};



},
function(){
this . assert = function(cond, message) { if ( !cond ) throw new Error ( message )  ; }

},
function(){

this .ensureSimpAssig = function(head) {
  switch(head.type) {
    case 'Identifier':
       this.assert( !( this.tight && arguments_or_eval(head.name) )  );

    case 'MemberExpression':
       return;

    default:
       this.assert(false);
  }
};

// an arr-pat is always to the left of an assig;
this .toAssig = function(head) {

  var i = 0;
  var firstEA = null;
  var list = null;

  this.firstEA = null;

  switch(head.type) {
     case 'Identifier':
        if (this.tight && arguments_or_eval(head.name))
          this.firstEA = head;
     case 'MemberExpression':
        return;

     case 'ObjectExpression':
        this.assert(head !== this.firstUnassignable )  ;

        list = head.properties;

        while ( i < list.length ) {
           this.toAssig(list[i].value);
           if ( !firstEA && this.firstEA )
                 firstEA =  this.firstEA ;
           list[i].type = 'AssignmentProperty';
           i++;
        }
        head.type = 'ObjectPattern';
        this.firstEA = firstEA ;
        return;

     case 'ArrayExpression':
        this.assert(head !== this.firstUnassignable )  ;

        list = head.elements;
        while ( i < list.length ) {
          if ( list[i] ) {
             this.toAssig(list[i]);
             if ( !firstEA && this.firstEA )
                   firstEA =  this.firstEA ;

             if ( list[i].type === 'SpreadElement' ) {
                i++;
                break ;
             }
          }
          i++;
        }
        this.assert( i === list.length );
        head.type = 'ArrayPattern';
        this.firstEA = firstEA ;
        return;

     case 'AssignmentExpression':
       this.assert(head !== this.firstUnassignable ) ;
       this.assert(head.operator === '='  ) ;
       head.type = 'AssignmentPattern';
       delete head.operator;
       if ( head === this.firstEAContainer )
          this.firstEA = this.defaultEA ;

       return;

     case 'SpreadElement':
       this.toAssig(head.argument);
       head.type = 'RestElement';
       return;
   
     case 'AssignmentPattern': // this would be the case in the event of converting an obj prop in the form of "name = val" rather than "name: val"
       return;

     default:
        this.assert(false ) ;
  }
};

this .parseAssignment = function(head, context ) {
    var o = this.ltraw;
    var firstEA = null ;

    if ( o === '=' ) {
       if ( this.firstEA ) {
            this.defaultEA = this.firstEA;
            this.firstEA = null;
       }

       this.toAssig(core(head));
       firstEA = this.firstEA;
    }
    else if ( o === '=>' )
      return this.parseArrowFunctionExpression (head, context & CONTEXT_FOR );
    else this.ensureSimpAssig(core(head));

    if ( this.unsatisfiedAssignment ) {
      this.assert( o === '=' ) ;
      this.unsatisfiedAssignment = false ;
    }

    if ( firstEA ) {
       this.assert( context & CONTEXT_ELEM_OR_PARAM );
    }

    var prec = this.prec;
    this.next();

    this.firstEA = null;
    var currentYS = this.firstYS; // save the current YS
    this.firstYS = null; // look for first YS in right hand side; please note this is the only case
                         // where firstYS is nulld

    if ( context & CONTEXT_PARAM ) { // if head is in paramPosition
      // save the first YS found in head
      var firstElemWithYS = this.firstElemWithYS; 
      var parenYS = this.parenYS;
    }

    var right = this. parseNonSeqExpr(PREC_WITH_NO_OP, context & CONTEXT_FOR ) ;
    this.firstEA = firstEA;
    var n = { type: 'AssignmentExpression', operator: o, start: head.start, end: right.end,
             left: core(head), right: core(right), loc: { start: head.loc.start, end: right.loc.end }};

    if ( this.firstYS ) { // if there was a YS in the right hand side; for example [ e = yield ] = -->yield 12<--is yield!
       if ( context & CONTEXT_PARAM ) { 
            this.firstElemWithYS = n; // the current assignment has a YS in its right hand side (`[e=yield]=yield 12`)
            this.parenYS = this.firstYS; // this is the YS in the right hand side (`yield 12`)
       }
    }
    else { // if there is no YS in the right hand side; for example [e = yield 120 ] = --> 12 <--not yield
       if ( context & CONTEXT_PARAM ) {
            this.firstElemWithYS = firstElemWithYS; // `e = yield 120`
            this.parenYS = parenYS; // `yield 120`
       }  
       this.firstYS = currentYS;
    }

    if ( firstEA )
      this.firstEAContainer = n;

    return n;
};



},
function(){
this. parseClass = function(context) {
  var startc = this.c0,
      startLoc = this.locBegin();

  var canBeStatement = this.canBeStatement, name = null;
  this.next () ;

  if ( canBeStatement && context !== CONTEXT_DEFAULT  ) {
     this.canBeStatement = false;
     this.assert ( this.lttype === 'Identifier' );
     name = this. validateID(null);
  }
  else if ( this.lttype === 'Identifier' && this.ltval !== 'extends' )
     name = this.validateID(null); 

  var classExtends = null;
  if ( this.lttype === 'Identifier' && this.ltval === 'extends' ) {
     this.next();
     classExtends = this.parseNonSeqExpr(PREC_WITH_NO_OP, CONTEXT_NONE);
  }

  var list = [];
  var nbodyStartc = this.c - 1, nbodyStartLoc = this.locOn(1);

  this.expectType ( '{' ) ;
  var elem = null, foundConstructor = false;

  var startcStatic, liStatic, colStatic, rawStatic, cStatic, startLocStatic;
  var isStatic = false;

  WHILE:
  while ( !false ) {
      if ( this.lttype === 'Identifier' && this.ltval === 'static' ) {
        startcStatic = this.c0;
        rawStatic = this.ltraw;
        colStatic = this.col;
        liStatic = this.li;
        cStatic = this.c;
        startLocStatic = this.locBegin();

        this.next();
        
        if ( this.lttype === '(' ) {
          elem = this.parseMeth( { type: 'Identifier', name: 'static', start: startcStatic, end: cStatic, raw: rawStatic,
                                  loc: { start: startLocStatic, end: { line: liStatic, column: colStatic } }}   , CLASS_MEM);
          list.push(elem);
          continue;
        }
        isStatic = !false;
      }
      SWITCH:
      switch ( this.lttype ) {
          case 'Identifier': switch ( this.ltval ) {
             case 'get': case 'set': 
               elem = this.parseSetGet(CLASS_MEM);
               break SWITCH;

             case 'constructor':
                this.assert( !foundConstructor );
                 
                 if ( !isStatic ) foundConstructor = !false;
                
             default:
               elem = this.parseMeth(this.id(), CLASS_MEM);
               break SWITCH;
          }
          case '[': elem = this.parseMeth(this.memberExpr(), CLASS_MEM); break;
          case 'Literal': elem = this.parseMeth(this.numstr(), CLASS_MEM); break ;

          case ';': this.next(); continue;
          case 'op': 
            if ( this.ltraw === '*' ) {
              elem = this.parseGen(CLASS_MEM);
              break ;
            }

          default: break WHILE;
      } 
      if ( isStatic ) {
        if ( elem.kind === 'constructor' ) 
          elem.kind   =  "method"; 

        elem.start = startcStatic;
        elem.loc.start = startLocStatic;

        elem['static'] = !false;
        isStatic = false;
      }
      list.push(elem);         
  }
  var endLoc = this.loc();
  var n = { type: canBeStatement ? 'ClassDeclaration' : 'ClassExpression',
            id: name,
           start: startc,
            end: this.c,
           superClass: classExtends,
           loc: { start: startLoc, end: endLoc },
            body: { type: 'ClassBody',
                   loc: { start: nbodyStartLoc, end: endLoc },
                   start: nbodyStartc,
                    end: this.c,
                    body: list } };

  this.expectType('}');
  if ( canBeStatement ) { this.foundStatement = !false; }

  return n;
};

this.parseSuper  = function   () {
   var n = { type: 'Super', loc: { start: this.locBegin(), end: this.loc() }, start: this.c0 , end: this.c };
   this.next() ;
   switch ( this.lttype ) {
        case '(':
          this.assert(this.scopeFlags & SCOPE_CONSTRUCTOR);
          break ;
        case '.':
        case '[':
           this.assert( this.scopeFlags & SCOPE_METH );
           break ;
        
       default:
          this.assert(false); 
   }

   if ( !this.firstYS )
         this.firstYS = n;

   return n;
};



},
function(){

this.readMultiComment = function () {
   var c = this.c,
       l = this.src,
       e = l.length,
       r,
       start = c,
       n = !false ;

   while ( c < e )
        switch (r = l.charCodeAt(c++ ) ) {
          case CHAR_MUL:
             if ( l.charCodeAt(c) === CHAR_DIV) {
                c++;
                this.col += (c-start);
                this.c=c;
                return n;
             }
             continue ;

          case CHAR_CARRIAGE_RETURN: if( CHAR_LINE_FEED === l.charCodeAt(c)) c++;
          case CHAR_LINE_FEED:
          case 0x2028:
          case 0x2029:
            start = c;
            if ( n ) n = false ;
            this.col = 0 ;
            this.li ++ ;
            continue;

//          default : if ( r >= 0x0D800 && r <= 0x0DBFF ) this.col-- ;
        }

   this.err( ' */ ' ) ;
};

this.readLineComment = function() {
    var c = this.c,
        l = this.src,
        e = l.length,
        r ;
    L:
    while ( c < e )
     switch (r = l.charCodeAt(c++ ) ) {
        case CHAR_CARRIAGE_RETURN : if ( CHAR_LINE_FEED === l . charCodeAt ( c) ) c++ ;
        case CHAR_LINE_FEED :
        case 0x2028:
        case 0x2029 :
          this.col = 0 ;
          this.li ++ ;
          break L ;

//        default : if ( r >= 0x0D800 && r <= 0x0DBFF ) this.col-- ;
     }
     this.c=c;
     return ;
};



},
function(){
this.parseExport = function() {
   this.assert( this.canBeStatement );
   this.canBeStatement = false;

   var startc = this.c0, startLoc = this.locBegin();
   this.next();

   var list = [], local = null, src = null ;
   var endI = 0;
   var ex = null;

   switch ( this.lttype ) {
      case 'op':
         this.assert(this.ltraw === '*' );
         this.next();
         this.expectID('from');
         this.assert(this.lttype === 'Literal' &&
              typeof this.ltval === STRING_TYPE );
         src = this.numstr();
         
         endI = this.semiI();
         this.foundStatement = !false;
         
         return  { type: 'ExportAllDeclaration',
                    start: startc,
                    loc: { start: startLoc, end: this.semiLoc() || src.loc.end },
                     end: endI || src.end,
                    source: src };

       case '{':
         this.next();
         var firstReserved = null;

         while ( this.lttype === 'Identifier' ) {
            local = this.id();
            if ( !firstReserved ) {
              this.throwReserved = false;
              this.validateID(local.name);
              if ( this.throwReserved )
                firstReserved = local;
              else
                this.throwReserved = !false;
            }
            ex = local;
            if ( this.lttype === 'Identifier' ) {
              this.assert( this.ltval === 'as' );
              this.next();
              this.assert( this.lttype === 'Identifier' );
              ex = this.id();
            }
            list.push({ type: 'ExportSpecifier',
                       start: local.start,
                       loc: { start: local.loc.start, end: ex.loc.end }, 
                        end: ex.end, exported: ex,
                       local: local }) ;

            if ( this.lttype === ',' )
              this.next();
            else
              break;
         }

         endI = this.c;
         var li = this.li, col = this.col;
   
         this.expectType( '}' );

         if ( this.lttype === 'Identifier' ) {
           this.assert( this.ltval === 'from' );
           this.next();
           this.assert( this.lttype === 'Literal' &&
                  typeof this.ltval ===  STRING_TYPE );
           src = this.numstr();
           endI = src.end;
         }
         else
            this.assert(!firstReserved);

         endI = this.semiI() || endI;

         this.foundStatement = !false;
         return { type: 'ExportNamedDeclaration',
                 start: startc,
                 loc: { start: startLoc, end: this.semiLoc() || ( src && src.loc.end ) ||
                                              { line: li, column: col } },
                  end: endI, declaration: null,
                   specifiers: list,
                  source: src };

   }

   var context = CONTEXT_NONE;

   if ( this.lttype === 'Identifier' && 
        this.ltval === 'default' ) { context = CONTEXT_DEFAULT; this.next(); }
  
   if ( this.lttype === 'Identifier' ) {
       switch ( this.ltval ) {
          case 'let':
          case 'const':
             this.assert(context !== CONTEXT_DEFAULT );
             this.canBeStatement = !false;
             ex = this.parseVariableDeclaration(CONTEXT_NONE);
             break;
               
          case 'class':
             this.canBeStatement = !false;
             ex = this.parseClass(context);
             break;
  
          case 'var':
             this.canBeStatement = !false;
             ex = this.parseVariableDeclaration(CONTEXT_NONE ) ;
             break ;

          case 'function':
             this.canBeStatement = !false;
             ex = this.parseFunc( context, WHOLE_FUNCTION, ANY_ARG_LEN );
             break ;
        }
   }

   if ( context !== CONTEXT_DEFAULT ) {

     this.assert(ex);
     endI = this.semiI();
     
     this.foundStatement = !false;
     return { type: 'ExportNamedDeclaration',
            start: startc,
            loc: { start: startLoc, end: ex.loc.end },
             end: ex.end , declaration: ex,
              specifiers: list ,
             source: null };
   }

   var endLoc = null;
   if ( ex === null ) {
        ex = this.parseNonSeqExpr(PREC_WITH_NO_OP, CONTEXT_NONE );
        endI = this.semiI();
        endLoc = this.semiLoc();
   }

   this.foundStatement = !false;
   return { type: 'ExportDefaultDeclaration',    
           start: startc,
           loc: { start: startLoc, end: endLoc || ex.loc.end },
            end: endI || ex.end, declaration: core( ex ) };
}; 

},
function(){
this.parseImport = function() {
  this.assert( this.canBeStatement );
  this.canBeStatement = false;

  var startc = this.c0, startLoc = this.locBegin();
  var hasList = false;
  this.next();
  var list = [], local = null;
  if ( this.lttype === 'Identifier' ) {
    local = this.validateID(null);
    list.push({ type: 'ImportDefaultSpecifier',
               start: local.start,
               loc: local.loc,
                end: local.end,
               local: local });
  }

  if ( this.lttype === ',' ) {
    this.assert(local !== null);
    this.next();
  }

  var spStartc = 0, spStartLoc = null;

  switch ( this.lttype ) {   
     case 'op':
       this.assert( this.ltraw === '*' );
       spStartc = this.c - 1;
       spStartLoc = this.locOn(1);
       this.next();
       this.expectID('as');
       this.assert(this.lttype === 'Identifier');
       local = this.validateID(null);
       list.push({ type: 'ImportNamespaceSpecifier',
                  start: spStartc,
                  loc: { start: spStartLoc, end: local.loc.end },
                   end: local.end,
                  local: local  }) ;
       break;

    case '{':
       hasList = !false;
       this.next();
       while ( this.lttype === 'Identifier' ) {
          local = this.id();
          var im = local; 
          if ( this.lttype === 'Identifier' ) {
             this.assert( this.ltval === 'as' );
             this.next();
             this.assert( this.lttype === 'Identifier' );
             local = this.validateID(null);
          }
          else this.validateID(local);

          list.push({ type: 'ImportSpecifier',
                     start: im.start,
                     loc: { start: im.loc.start, end: local.loc.end },
                      end: local.end, imported: im,
                    local: local }) ;

          if ( this.lttype === ',' )
             this.next();
          else
             break ;                                  
       }

       this.expectType('}');
       break ;
   }
    
   if ( list.length || hasList )
     this.expectID('from');

   this.assert(this.lttype === 'Literal' &&
        typeof this.ltval === STRING_TYPE );

   var src = this.numstr();
   var endI = this.semiI() || src.end, endLoc = this.semiLoc() || src.loc.end;
   
   this.foundStatement = !false;
   return { type: 'ImportDeclaration',
           start: startc,
           loc: { start: startLoc, end: endLoc  },
            end:  endI , specifiers: list,
           source: src };
}; 

},
function(){
this.err = function(errorType, errorTok, args) {
   if ( has.call(this.errorHandlers, errorType) )
     return this.handleError(this.errorHandlers[errorType], errorTok, args );

   throw new CustomError( createMessage( Errors[errorType], errorTok, args ) );
};

function CustomError(start,li,col,message) {
   this.atChar = start;
   this.atLine = li;
   this.atCol = col;
   this.message = message;

}

function createMessage( errorMessage, errorTok, args  ) {
  return errorMessage.replace( /%\{([^\}]*)\}/g,
  function(matchedString, name, matchIndex, wholeString) {
     if ( name.length === 0 )
       throw new Error( "placeholder empty on " + matchIndex + " for [" + errorMessage + "]" );

     if ( !has.call(args, name) )
       throw new Error( "[" + name + "] not found in params " );
     
     return args[name] + "" ;
  }) ;

}
   
this.handleError = function(handlerFunction, errorTok, args ) {
   return handlerFunction.call( this, params, coords );

};


},
function(){
this.readEsc = function ()  {
  var src = this.src, b0 = 0, b = 0;
  switch ( src.charCodeAt ( ++this.c ) ) {
   case CHAR_BACK_SLASH: return '\\';
   case CHAR_MULTI_QUOTE: return'\"' ;
   case CHAR_SINGLE_QUOTE: return '\'' ;
   case CHAR_b: return '\b' ;
   case CHAR_v: return '\v' ;
   case CHAR_f: return '\f' ;
   case CHAR_t: return '\t' ;
   case CHAR_r: return '\r' ;
   case CHAR_n: return '\n' ;
   case CHAR_u:
      b0 = this.peekUSeq();
      if ( b0 >= 0x0D800 && b0 <= 0x0DBFF ) {
        this.c++;
        return String.fromCharCode(b0, this.peekTheSecondByte());
      }
      return fromcode(b0);

   case CHAR_x :
      b0 = toNum(this.src.charCodeAt(++this.c));
      this.assert( b0 !== -1 );
      b = toNum(this.src.charCodeAt(++this.c));
      this.assert( b !== -1 );
      return String.fromCharCode((b0<<4)|b);

   case CHAR_0: case CHAR_1: case CHAR_2:
   case CHAR_3:
       b0 = src.charCodeAt(this.c);
       if ( this.tight ) {
          if ( b0 === CHAR_0 ) {
               b0 = src.charCodeAt(this.c +  1);
               if ( b0 < CHAR_0 || b0 >= CHAR_8 )
                 return '\0';
          }
          this.assert(false);
       }

       b = b0 - CHAR_0;
       b0 = src.charCodeAt(this.c + 1 );
       if ( b0 >= CHAR_0 && b0 < CHAR_8 ) {
          this.c++;
          b <<= 3;
          b += (b0-CHAR_0);
          b0 = src.charCodeAt(this.c+1);
          if ( b0 >= CHAR_0 && b0 < CHAR_8 ) {
             this.c++;
             b <<= 3;
             b += (b0-CHAR_0);
          }
       }
       return String.fromCharCode(b)  ;

    case CHAR_4: case CHAR_5: case CHAR_6: case CHAR_7:
       this.assert(!this.tight);
       b0 = src.charCodeAt(this.c);
       b  = b0 - CHAR_0;
       b0 = src.charCodeAt(this.c + 1 );
       if ( b0 >= CHAR_0 && b0 < CHAR_8 ) {
          this.c++; 
          b <<= 3; 
          b += (b0-CHAR_0);
       }
       return String.fromCharCode(b)  ;

   case CHAR_8:
   case CHAR_9:
       this.assert(false);
   case CHAR_CARRIAGE_RETURN:
      if ( src.charCodeAt(this.c + 1) === CHAR_LINE_FEED ) this.c++;
   case CHAR_LINE_FEED:
   case 0x2028:
   case 0x2029:
      this.col = 0;
      this.li++;
      return '';

   default:
      return src.charAt(this.c) ;
  }
};



},
function(){

this.peekTheSecondByte = function () {
  var e = this.src.charCodeAt(this.c);
  if (CHAR_BACK_SLASH === e) {
    if (CHAR_u !== this.src.charCodeAt(++this.c)) this.err('the \\ must have "u" after it ;instead, it has ' + this.src[this.c] );
    e = (this.peekUSeq());
  }
//  else this.col--;
  if (e < 0x0DC00 || e > 0x0DFFF )
      this.err('Byte (' + _h(e)+ ') must be in range 0x0DC00 to 0x0DFFF, but it is not ');

  return e;
};

this.peekUSeq = function () {
  var c = ++this.c, l = this.src, e = l.length;
  var byteVal = 0;
  var n = l.charCodeAt(c);
  if (CHAR_LCURLY === n) { // u{ 
    ++c;
    n = l.charCodeAt(c);
    do {
      n = toNum(n);
      this.assert (n !== - 1);
      byteVal <<= 4;
      byteVal += n;
      this.assert (byteVal <= 0x010FFFF );
      n = l.charCodeAt( ++ c);
    } while (c < e && n !== CHAR_RCURLY);

    this.assert ( n === CHAR_RCURLY ) ;
    this.c = c;
    return byteVal;
  }

  n = toNum(l.charCodeAt(c)); this.assert( n !== -1 ); byteVal = n; c++ ;
  n = toNum(l.charCodeAt(c)); this.assert( n !== -1 ); byteVal <<= 4; byteVal += n; c++ ;
  n = toNum(l.charCodeAt(c)); this.assert( n !== -1 ); byteVal <<= 4; byteVal += n; c++ ;
  n = toNum(l.charCodeAt(c)); this.assert( n !== -1 ); byteVal <<= 4; byteVal += n;

  this.c = c;

  return byteVal;
};



},
function(){

this . parseFor = function() {
  this.ensureStmt();
  this.fixupLabels(!false) ;

  var startc = this.c0,
      startLoc = this.locBegin();

  this.next () ;
  this.expectType('(' ) ;

  var head = null;
  var headIsExpr = false;

  var scopeFlags = this.scopeFlags;

  if ( this.lttype === 'Identifier' ) switch ( this.ltval ) {
     case 'var':
        this.canBeStatement = !false;
        head = this.parseVariableDeclaration(CONTEXT_FOR);
        break;

     case 'let':
        if ( this.v >= 5 ) {
          this.canBeStatement = !false;
          head = this.parseLet(CONTEXT_FOR);
        }

        break;

     case 'const' :

        this.assert( this.v >= 5 );
        this.canBeStatement = !false;
        head = this. parseVariableDeclaration(CONTEXT_FOR);
           break ;
  }

  if ( head === null ) {
       headIsExpr = !false;
       head = this.parseExpr( CONTEXT_NULLABLE|CONTEXT_ELEM|CONTEXT_FOR ) ;
  }
  else 
     this.foundStatement = false;

  var kind = 'ForOfStatement';
  var nbody = null;
  var afterHead = null;

  if ( head !== null && // if we have a head
       ( headIsExpr || // that is an expression
       (head.declarations.length === 1 /* && !head.declarations[0].init */ ) ) && // or one and only one lone declarator
       this.lttype === 'Identifier' ) { // then if the token ahead is an id
    switch ( this.ltval ) {
       case 'in':
          kind = 'ForInStatement';

       case 'of':
          if ( this.unsatisfiedAssignment )
            this.unsatisfiedAssignment = null;

          if (headIsExpr) this.toAssig(core(head));

          this.next();
          afterHead = this.parseNonSeqExpr(PREC_WITH_NO_OP, CONTEXT_NONE) ;
          this.expectType(')');

          this.scopeFlags |= ( SCOPE_BREAK|SCOPE_CONTINUE );
          nbody = this.parseStatement(false);
          this.scopeFlags = scopeFlags;

          this.foundStatement = !false;
          return { type: kind, loc: { start: startLoc, end: nbody.loc.end },
            start: startc, end: nbody.end, right: core(afterHead), left: core(head), body: nbody };

       default:
          this.assert(false) ;
    }
  }

  this.assert(!this.unsatisfiedAssignment);
/*
  if ( head && !headIsExpr ) {
    head.end = this.c;
    head.loc.end = { line: head.loc.end.line, column: this.col };
  }
*/
  this.expectType(';');
  afterHead = this.parseExpr(CONTEXT_NULLABLE );
  this.expectType(';');
  var tail = this.parseExpr(CONTEXT_NULLABLE );
  this.expectType(')');

  this.scopeFlags |= ( SCOPE_CONTINUE|SCOPE_BREAK );
  nbody = this.parseStatement(false);
  this.scopeFlags = scopeFlags;

  this.foundStatement = !false;
  return { type: 'ForStatement', init: head && core(head), start : startc, end: nbody.end,
         test: afterHead && core(afterHead),
         loc: { start: startLoc, end: nbody.loc.end },
          update: tail && core(tail),
         body: nbody };
};



},
function(){
this .parseArgs  = function (argLen) {
  var list = [], elem = null;

  this.expectType('(') ;

  var firstNonSimpArg = null;
  while ( list.length !== argLen ) {
    elem = this.parsePattern();
    if ( elem ) {
       if ( this.lttype === 'op' && this.ltraw === '=' ) {
         elem = this.parseAssig(elem);
         if ( elem.left.type === 'Identifier' ) {
           this.assert( this.argNames[elem.left.name+'%'] === null );
           this.argNames[elem.left.name+'%'] = elem;
         }
       }

       if ( !firstNonSimpArg && elem.type !== 'Identifier' )
             firstNonSimpArg =  elem;

       list.push(elem);
    }
    else
       break ;
    
    if ( this.lttype === ',' )
       this.next();
    else
        break ;
 
  }
  if ( argLen === ANY_ARG_LEN ) {
     if ( this.lttype === '...' ) {
        this.inComplexArgs = !false;
        elem = this.parseRestElement();
        this.inComplexArgs = this.tight ;
        list.push( elem  );
        if ( !firstNonSimpArg )
              firstNonSimpArg = elem;
     }
  }
  else
     this.assert( list.length === argLen );

  this.expectType(')');

  if ( firstNonSimpArg )
     this.firstNonSimpArg = firstNonSimpArg ;
 
  return list;
};

this .addArg = function(id) {
  var name = id.name + '%';
  if ( has.call(this.argNames, name) ) {
    this.assert( !this.inComplexArgs );
    if ( this.argNames[name] === null )
      this.argNames[name] = id ; // this will be useful if the body has a strictness directive
    else
      this.assert( this.argNames[name].type === 'Identifier' );
  }
  else
     this.argNames[name] = null ;
};

  
this .parseFunc = function(context, argListMode, argLen ) {
  var canBeStatement = false, startc = this.c0, startLoc = this.locBegin();
  var prevLabels = this.labels;
  var prevStrict = this.tight;
  var prevInArgList = this.isInArgList;
  var prevArgNames = this.argNames;
  var prevScopeFlags = this.scopeFlags;
  var prevYS = this.firstYS ;
  var prevNonSimpArg = this.firstNonSimpArg;

  if ( !this.canBeStatement )
    this.scopeFlags = 0; //  FunctionExpression's BindingIdentifier can be 'yield', even when in a *

  var isGen = false;

  var currentFuncName = null;

  if ( argListMode & WHOLE_FUNCTION ) {
     if ( canBeStatement = this.canBeStatement )
          this.canBeStatement = false;

     this.next();

     if ( this.lttype === 'op' && this.ltraw === '*' ) {
          isGen = !false;
          this.next();
     }
     if ( canBeStatement && context !== CONTEXT_DEFAULT  )  {
        this.assert( this.lttype === 'Identifier' ) ;
        currentFuncName = this.validateID(null);
        this.assert( !( this.tight && arguments_or_eval(currentFuncName.name) ) );
     }
     else if ( this. lttype === 'Identifier' ) {
        currentFuncName = this.validateID(null);
        this.assert( !( this.tight && arguments_or_eval(currentFuncName.name) ) );
     }
     else
        currentFuncName = null;
  }
  else if ( argListMode & ARGLIST_AND_BODY_GEN )
     isGen = !false; 

  if ( this.scopeFlags )
       this.scopeFlags = 0;

  var prevComplexArgs = this.inComplexArgs;
  this.inComplexArgs = this.tight;
  this.isInArgList = !false;
  this.argNames = {};
  var argList = this.parseArgs(argLen) ;
  this.isInArgList = false;
  this.tight = this.tight || argListMode !== WHOLE_FUNCTION;
  this.scopeFlags = SCOPE_FUNCTION;
  if ( argListMode & METH_FUNCTION )
    this.scopeFlags |= SCOPE_METH;
  
  else if ( argListMode & CONSTRUCTOR_FUNCTION )
    this.scopeFlags |= SCOPE_CONSTRUCTOR;

  if ( isGen ) this.scopeFlags |= SCOPE_YIELD;
   
  this.inComplexArgs = false;
  var nbody = this.parseFuncBody(context);
  var n = { type: canBeStatement ? 'FunctionDeclaration' : 'FunctionExpression',
            id: currentFuncName,
           start: startc,
           end: nbody.end,
           generator: isGen,
           body: nbody,
            loc: { start: startLoc, end: nbody.loc.end },
           expression: nbody.type !== 'BlockStatement' ,  
            params: argList };

  if ( canBeStatement )
     this.foundStatement = !false;

  this.labels = prevLabels;
  this.isInArgList = prevInArgList;
  this.argNames = prevArgNames; 
  this.tight = prevStrict;
  this.scopeFlags = prevScopeFlags;
  this.firstYS = prevYS;
  this.firstNonSimpArg = prevNonSimpArg;
  this.inComplexArgs = prevComplexArgs;

  return  n  ;
};

this.parseFuncBody = function(context) {
  if ( this.lttype !== '{' )
    return this.parseNonSeqExpr(PREC_WITH_NO_OP, context);

  var startc= this.c - 1, startLoc = this.locOn(1);
  var list = [], stmt = null;
  this.next() ;
  stmt = this.parseStatement(!false);

  if ( !this.tight && this.v > 5 && stmt && 
       stmt.type === 'ExpressionStatement' && stmt.expression.type === 'Literal' )
       switch (this.src.slice(stmt.expression.start,stmt.expression.end) )  {
           case "'use strict'":
           case '"use strict"':
              this.makeStrict();
       }

  while ( stmt ) { list.push(stmt); stmt = this.parseStatement(!false); }
  var n = { type : 'BlockStatement', body: list, start: startc, end: this.c,
           loc: { start: startLoc, end: this.loc() } };
  this.expectType ( '}' );

  return  n;
};

this . makeStrict  = function() {
   this.assert( !this.firstNonSimpArg )  ; 
   if ( this.tight ) return;

   this.tight = !false;

   var argName = null;
   for ( argName in this.argNames ) {
      this.assert( this.argNames[argName] === null );
      argName = argName.substring(0,argName.length-1) ;
      this.assert(!arguments_or_eval(argName));
      this.validateID(argName);

   }
};



},
function(){
this . notId = function(id) { throw new Error ( 'not a valid id '   +   id )   ;  } ;
this. parseIdStatementOrId = function ( context ) {
  var id = this.ltval ;
  var pendingExprHead = null;

  SWITCH:
  switch (id.length) {
    case 1:
       pendingExprHead = this.id(); break SWITCH ;

    case 2: switch (id) {
        case 'do': return this.parseDoWhileStatement();
        case 'if': return this.parseIfStatement();
        case 'in':
           if ( context & CONTEXT_FOR )
             return null;
 
           this.notId() ;
        default: pendingExprHead = this.id(); break SWITCH ;
    }

    case 3: switch (id) {
        case 'new':
             if ( this.canBeStatement ) {
                this.canBeStatement = false ;
                this.pendingExprHead = this.parseNewHead();
                return null;
             }
             return this.parseNewHead();

        case 'for': return this.parseFor();
        case 'try': return this.parseTryStatement();
        case 'let':
             if ( this.canBeStatement && this.v >= 5 )
               return this.parseLet(CONTEXT_NONE);

             this.assert(!this.tight);
             pendingExprHead = this.id();
             break SWITCH;

        case 'var': return this.parseVariableDeclaration( context & CONTEXT_FOR );
        case 'int':
            if ( this.v <= 5 )
              this.errorReservedID();

        default: pendingExprHead = this.id(); break SWITCH  ;
    }

    case 4: switch (id) {
        case 'null':
            pendingExprHead = this.idLit(null);
            break SWITCH;
        case 'void':
            if ( this.canBeStatement )
               this.canBeStatement = false;
            this.lttype = 'u'; 
            this.isVDT = !false;
            return null;
        case 'this':
            pendingExprHead = this. parseThis();
            break SWITCH;
        case 'true':
            pendingExprHead = this.idLit(!false);
            break SWITCH;
        case 'case':
            if ( this.canBeStatement ) this.canBeStatement = false ;
            return null;

        case 'else':
            this.notId();
        case 'with':
            return this.parseWithStatement();
        case 'enum': case 'byte': case 'char': case 'goto':
        case 'long':
            if ( this. v <= 5 ) this.errorReservedID();

        default: pendingExprHead = this.id(); break SWITCH  ;
    }

    case 5: switch (id) {
        case 'super': pendingExprHead = this.parseSuper(); break SWITCH;
        case 'break': return this.parseBreakStatement();
        case 'catch': this.notId ()  ;
        case 'class': return this.parseClass(CONTEXT_NONE ) ;
        case 'const':
            this.assert(this.v>=5);
            return this.parseVariableDeclaration(CONTEXT_NONE);

        case 'throw': return this.parseThrowStatement();
        case 'while': return this.parseWhileStatement();
        case 'yield': 
             if ( this.scopeFlags & SCOPE_YIELD ) {
                if ( this.canBeStatement )
                     this.canBeStatement = false;

                this.lttype = 'yield';
                return null;
             }

             pendingExprHead = this.id();
             break SWITCH;
                 
        case 'false':
                pendingExprHead = this.idLit(false);
                break  SWITCH;
        case 'final':
        case 'float':
        case 'short':
            if ( this. v <= 5 ) this.errorReservedID() ;
        case 'await':
        default: pendingExprHead = this.id(); break SWITCH ;
    }

    case 6: switch (id) {
        case 'static':
            if ( this.tight || this.v <= 5 )
               this.error();

        case 'delete':
        case 'typeof':
            if ( this.canBeStatement )
               this.canBeStatement = false ;
            this.lttype = 'u'; 
            this.isVDT = !false;
            return null;

        case 'export': 
            this.assert( !this.isScript );
            return this.parseExport() ;

        case 'import':
            this.assert( !this.isScript );
            return this.parseImport();

        case 'return': return this.parseReturnStatement();
        case 'switch': return this.parseSwitchStatement();
        case 'double': case 'native': case 'throws':
            if ( this. v <= 5 ) this.errorReservedID();

        default: pendingExprHead = this.id(); break SWITCH ;
    }

    case 7: switch (id) {
        case 'default':
           if ( this.canBeStatement ) this.canBeStatement = false ;
           return null;

        case 'extends': case 'finally':
           this.notId() ;

        case 'package': case 'private':
            if ( this. tight  )
               this.errorReservedID();

        case 'boolean':
            if ( this. v <= 5 )
               this.errorReservedID();

        default: pendingExprHead = this.id(); break SWITCH  ;
    }

    case 8: switch (id) {
        case 'function': return this.parseFunc(context&CONTEXT_FOR, WHOLE_FUNCTION, ANY_ARG_LEN );
        case 'debugger': return this.prseDbg();
        case 'continue': return this.parseContinueStatement();
        case 'abstract': case 'volatile':
           if ( this. v <= 5 ) this.errorReservedID();

        default: pendingExprHead = this.id(); break SWITCH  ;
    }

    case 9: switch (id ) {
        case 'interface': case 'protected':
           if (this.tight) this.errorReservedID() ;

        case 'transient':
           if (this.v <= 5) this.errorReservedID();

        default: pendingExprHead = this.id(); break SWITCH  ;
    }

    case 10: switch ( id ) {
        case 'instanceof':
           this.notId()  ;
        case 'implements':
           if ( this.v <= 5 || this.tight )
             this.resv();

        default: pendingExprHead = this.id(); break SWITCH ;
    }

    case 12:
       if ( this.v <= 5 && id === 'synchronized' ) this.errorReservedID();

    default: pendingExprHead = this.id();

  }

  if ( this.canBeStatement ) {
    this.canBeStatement = false;
    this.pendingExprHead = pendingExprHead;
    return null;
  }

  return pendingExprHead;
};
 

},
function(){
this.readAnIdentifierToken = function (v) {
   // if head has been a u, the location has already been saved in #next()
   if ( !v ) {
     this.li0 = this.li;
     this.col0 = this.col;
     this.c0 = this.c;
   }

   var c = this.c, src = this.src, len = src.length, peek;
   c++; // start reading the body

   var byte2, startSlice = c; // the head is already supplied in v

   while ( c < len ) {
      peek = src.charCodeAt(c); 
      if ( isIDBody(peek) ) {
         c++;
         continue;
      }

      if ( peek === CHAR_BACK_SLASH ) {
         if ( !v ) // if all previous characters have been non-u characters 
            v = src.charAt (startSlice-1); // v = IDHead

         if ( startSlice < c ) // if there are any non-u characters behind the current '\'
            v += src.slice(startSlice,c) ; // v = v + those characters

         this.c = ++c;
         this.assert (CHAR_u === src.charCodeAt(c) );

         peek = this. peekUSeq() ;
         if (peek >= 0x0D800 && peek <= 0x0DBFF ) {
           this.c++;
           byte2 = this.peekTheSecondByte();
           this.assert(isIDBody(((peek-0x0D800)<<10) + (byte2-0x0DC00) + 0x010000));
           v += String.fromCharCode(peek, byte2);
         }
         else {
            this.assert(isIDBody(peek));
            v += fromcode(peek);
         }
         c = this.c;
         c++;
         startSlice = c;
      }
      else if (peek >= 0x0D800 && peek <= 0x0DBFF ) {
         if ( !v ) { v = src.charAt(startSlice-1); }
         if ( startSlice < c ) v += src.slice(startSlice,c) ;
         c++;
         this.c = c; 
         byte2 = this.peekTheSecondByte() ;
         this.assert(isIDBody(((peek-0x0D800 ) << 10) + (byte2-0x0DC00) + 0x010000));
         v += String.fromCharCode(peek, byte2);
         c = this.c ;
         c++;
         startSlice = c;
      }
      else { break ; } 
    }
    if ( v ) { // if we have come across at least one u character
       if ( startSlice < c ) // but all others that came after the last u-character have not been u-characters
         v += src.slice(startSlice,c); // then append all those characters

       this.ltraw = src.slice(this.c0,c);
       this.ltval = v  ;
    }
    else {
       this.ltval = this.ltraw = v = src.slice(startSlice-1,c);
    }
    this.c = c;
    this.lttype= 'Identifier';
};



},
function(){

this.parseLet = function(context) {

// this function is only calld when we have a 'let' at the start of an statement,
// or else when we have a 'let' at the start of a for's init; so, CONTEXT_FOR means "at the start of a for's init ",
// not 'in for'
 
  var startc = this.c0, startLoc = this.locBegin();
  var c = this.c, li = this.li, col = this.col;

  var letDecl = this.parseVariableDeclaration(context);

  if ( letDecl )
    return letDecl;

  this.assert(!this.tight);

  this.canBeStatement = false;
  this.pendingExprHead = {
     type: 'Identifier',
     name: 'let',
     start: startc,
     end: c,
     loc: { start: startLoc, end: { line: li, column: col } }
  };

  return null ;
};



},
function(){
this.loc = function() { return { line: this.li, column: this.col }; };
this.locBegin = function() { return  { line: this.li0, column: this.col0 }; };
this.locOn = function(l) { return { line: this.li, column: this.col - l }; };



},
function(){
this .memberID = function() { return this.v > 5 ? this.id() : this.validateID(null) ; };
this .memberExpr = function() {
  var startc = this.c - 1,
      startLoc = this.locOn(1);
  this.next() ;
  var e = this.parseExpr(CONTEXT_NONE);
  this.assert(e);
  var n = { type: PAREN, expr: e, start: startc, end: this.c, loc: { start: startLoc, end: this.loc() } } ;
  this.expectType (']');
  return n;
};



},
function(){
this.parseNewHead = function () {
  var startc = this.c0, end = this.c, startLoc = this.locBegin(), li = this.li, col = this.col, raw = this.ltraw ;
  this.next () ;
  if ( this.lttype === '.' ) {
     this.next();
     return this.parseMeta(startc ,end,startLoc,{line:li,column:col},raw );
  }

  var head, elem, inner;
  switch (this  .lttype) {
    case 'Identifier':
       head = this.parseIdStatementOrId (CONTEXT_NONE);
       this.assert(head);
       break;

    case '[':
       head = this. parseArrayExpression();
       this.assert(!this.unsatisfiedAssignment);
       break ;

    case '(':
       head = this. parseParen() ;
       this.assert(!this.unsatisfiedArg ) ;
       break ;

    case '{':
       head = this. parseObjectExpression() ;
       this.assert(!this.unsatisfiedAssignment);
       break ;

    case '/':
       head = this. parseRegExpLiteral () ;
       break ;

    case '`':
       head = this. parseTemplateLiteral () ;
       break ;

    case 'Literal':
       head = this.numstr ();
       break ;

    default: this.assert(false) ;
  }

  var inner = core( head ) ;
  while ( !false ) {
    switch (this. lttype) {
       case '.':
          this.next();
          elem = this.memberID();
          head =   {  type: 'MemberExpression', property: elem, start: head.start, end: elem.end,
                      loc: { start: head.loc.start, end: elem.loc.end }, object: inner, computed: false };
          inner = head;
          continue;

       case '[':
          this.next() ;
          elem = this.parseExpr(CONTEXT_NONE) ;
          head =  { type: 'MemberExpression', property: core(elem), start: head.start, end: this.c,
                    loc: { start : head.loc.start, end: this.loc() }, object: inner, computed: !false };
          inner = head ;
          this.expectType(']') ;
          continue;

       case '(':
          elem = this. parseArgList();
          inner = { type: 'NewExpression', callee: inner, start: startc, end: this.c,
                    loc: { start: startLoc, end: this.loc() }, arguments: elem };
          this. expectType (')');
          return inner;

       case '`' :
           elem = this.parseTemplateLiteral () ;
           head = {
                type : 'TaggedTemplateExpression' ,
                quasi :elem ,
                start: head.start,
                 end: elem.end,
                loc : { start: head.loc.start, end: elem.loc.end },
                tag : inner
            };
            inner = head;
            continue ;

        default: return { type: 'NewExpression', callee: inner, start: startc, end: head.end,
                 loc: { start: startLoc, end: head.loc.end }, arguments : [] };

     }
  }
};


},
function(){
this.next = function () {
  if ( this.skipS() ) return;
  if (this.c >= this.src.length) {
      this. lttype =  'eof' ;
      this.ltraw=  '<<EOF>>';
      return ;
  }
  var c = this.c,
      l = this.src,
      e = l.length,
      r = 0,
      peek,
      start =  c;

  peek  = this.src.charCodeAt(start);
  if ( isIDHead(peek) )this.readAnIdentifierToken('');
  else if (Num(peek))this.readNumberLiteral(peek);
  else {
    switch (peek) {
      case CHAR_MIN: this.opMin(); break;
      case CHAR_ADD: this.opAdd() ; break;
      case CHAR_MULTI_QUOTE:
      case CHAR_SINGLE_QUOTE:
        return this.readStrLiteral(peek);
      case CHAR_SINGLEDOT: this.readDot () ; break ;
      case CHAR_EQUALITY_SIGN:  this.opEq () ;   break ;
      case CHAR_LESS_THAN: this.opLess() ;   break ;
      case CHAR_GREATER_THAN: this.opGrea() ;   break ;
      case CHAR_MUL:
         this.ltraw = '*';
         this.lttype = 'op';
         c++ ;
         if ( l.charCodeAt(c+1) === peek) {
           this.ltraw = '**';
           c++ ;
         }
         if (l.charCodeAt(c) === CHAR_EQUALITY_SIGN) {
           c++;
           this. prec = PREC_OP_ASSIG;
           this.ltraw += '=';
         }
         else {
           this. prec = PREC_MUL;
         }
         this.c=c;
         break ;

      case CHAR_MODULO:
         this.lttype = 'op';
         c++ ;
         if (l.charCodeAt(c) === CHAR_EQUALITY_SIGN) {
           c++;
           this. prec = PREC_OP_ASSIG;
           this.ltraw = '%=';
         }
         else {
           this. prec = PREC_MUL;
           this.ltraw = '%';
         }
         this.c=c;
         break ;

      case CHAR_EXCLAMATION:
         c++ ;
         if ( l.charCodeAt(c) === CHAR_EQUALITY_SIGN ) {
           this. lttype = 'op';
           c++;
           this.prec = PREC_EQUAL;
           if ( l.charCodeAt(c) === CHAR_EQUALITY_SIGN ) {
             this.ltraw = '!==';
             c++;
           }
           else this.ltraw = '!=' ;
         }
         else {
           this .lttype = 'u' ;
           this.ltraw = '!';
         }
         this.c=c;
         break ;

      case CHAR_COMPLEMENT:
            c++;
            this.c=c;
            this.ltraw = '~';
            this.lttype = 'u';
            break ;

      case CHAR_OR:
         c++;
         this.lttype = 'op' ;
         switch ( l.charCodeAt(c) ) {
            case CHAR_EQUALITY_SIGN:
                 c++;
                 this.prec = PREC_OP_ASSIG ;
                 this.ltraw = '|=';
                 break ;

            case CHAR_OR:
                 c++;
                 this.prec = PREC_BOOL_OR;
                 this.ltraw = '||'; break ;

            default:
                 this.prec = PREC_BIT_OR;
                 this.ltraw = '|';
                 break ;
         }
         this.c=c;
         break;

      case CHAR_AND:
          c++ ;
          this.lttype = 'op';
          switch ( l.charCodeAt(c) ) {
            case CHAR_EQUALITY_SIGN:
               c++;
               this. prec = PREC_OP_ASSIG;
               this.ltraw = '&=';
               break;

            case CHAR_AND:
               c ++;
               this.prec = PREC_BOOL_AND;
               this.ltraw = '&&';
               break ;

            default:
               this.prec = PREC_BIT_AND;
               this.ltraw = '&';
               break ;
         }
         this.c=c;
         break ;

      case CHAR_XOR:
        c++;
        this.lttype = 'op';
        if ( l.charCodeAt(c) === CHAR_EQUALITY_SIGN ) {
          c++;
          this.prec = PREC_OP_ASSIG;
          this.ltraw = '^=';
        }
        else  {
          this.  prec = PREC_XOR;
          this.ltraw = '^';
        }
        this.c=c  ;
        break;

      default:

        var mustBeAnID = 0 ;

        this.c = c;
        this.c0 = c;
        this.col0 = this.col;
        this.li0 = this.li;

        if (CHAR_BACK_SLASH === peek) {
            mustBeAnID = 1;
            peek = l.charCodeAt(++ this.c);
            this.assert (peek === CHAR_u);
            peek = this.peekUSeq();
        }
        if (peek >= 0x0D800 && peek <= 0x0DBFF ) {
            mustBeAnID = 2 ;
            this.c++;
            r = this.peekTheSecondByte();
        }
        if (mustBeAnID) {
            this.assert(isIDHead(mustBeAnID === 1 ? peek :
                  ((peek - 0x0D800)<<10) + (r-0x0DC00) + (0x010000) ));
            this.readAnIdentifierToken( mustBeAnID === 2 ?
                String.fromCharCode( peek, r ) :
                fromcode( peek )
            );
        }
        else 
          this.readMisc();
    }
  }

  this.col += ( this.c - start );
};

this . opEq = function()  {
    var c = this.c;
    var l = this.src;
    this.lttype = 'op';
    c++ ;

    if ( l.charCodeAt(c) === CHAR_EQUALITY_SIGN ) {
      c++;
      this.prec = PREC_EQUAL ;
      if ( l.charCodeAt(c ) === CHAR_EQUALITY_SIGN ){
        c++ ;
        this.ltraw = '===';
      }
      else this.ltraw = '==';
    }
    else {
        this.prec = PREC_SIMP_ASSIG;
        if ( l.charCodeAt(c) === CHAR_GREATER_THAN) {
          c++;
          this. ltraw = '=>';
        }
        else  this.ltraw = '=' ;
    }

    this.c=c;
};

this . opMin = function() {
   var c = this.c;
   var l = this.src;
   c++;

   switch( l.charCodeAt(c) ) {
      case  CHAR_EQUALITY_SIGN:
         c++;
         this.prec = PREC_OP_ASSIG;
         this. lttype = 'op';
         this.ltraw = '-=';
         break ;

      case  CHAR_MIN:
         c++;
         this.prec = PREC_OO;
         this. lttype = this.ltraw = '--';
         break ;

      default:
         this.ltraw = this.lttype = '-';
         break ;
   }
   this.c=c;
};

this . opLess = function () {
  var c = this.c;
  var l = this.src;
  this.lttype = 'op';
  c++ ;

  if ( l.charCodeAt(c ) === CHAR_LESS_THAN ) {
     c++;
     if ( l.charCodeAt(c) === CHAR_EQUALITY_SIGN ) {
        c++;
        this. prec = PREC_OP_ASSIG ;
        this. ltraw = '<<=' ;
     }
     else {
        this.ltraw = '<<';
        this. prec = PREC_SH ;
     }
  }
  else  {
     this. prec = PREC_COMP ;
     if ( l.charCodeAt(c) === CHAR_EQUALITY_SIGN ) {
        c++ ;
        this.ltraw = '<=';
     }
     else this.ltraw = '<';
  }

  this.c=c;
};

this . opAdd = function() {
   var c = this.c;
   var l = this.src;
   c++ ;

   switch ( l.charCodeAt(c) ) {
       case CHAR_EQUALITY_SIGN:
         c ++ ;
         this. prec = PREC_OP_ASSIG;
         this. lttype = 'op';
         this.ltraw = '+=';

         break ;

       case CHAR_ADD:
         c++ ;
         this. prec = PREC_OO;
         this. lttype = '--';
         this.ltraw = '++';
         break ;

       default: this. ltraw = '+' ; this. lttype = '-';
   }
   this.c=c;
};

this . opGrea = function()   {
  var c = this.c;
  var l = this.src;
  this.lttype = 'op';
  c++ ;

  if ( l.charCodeAt(c) === CHAR_GREATER_THAN ) {
    c++;
    if ( l.charCodeAt(c) === CHAR_GREATER_THAN ) {
       c++;
       if ( l.charCodeAt(c) === CHAR_EQUALITY_SIGN ) {
         c++ ;
         this. prec = PREC_OP_ASSIG;
         this. ltraw = '>>>=';
       }
       else {
         this. ltraw = '>>>';
         this. prec = PREC_SH;
       }
    }
    else if ( l.charCodeAt(c) === CHAR_EQUALITY_SIGN ) {
       c++ ;
       this. prec = PREC_OP_ASSIG;
       this.ltraw = '>>=';
    }
    else {
       this. prec=  PREC_SH;
       this. ltraw    = '>>';
    }
  }
  else  {
    this. prec = PREC_COMP  ;
    if ( l.charCodeAt(c) === CHAR_EQUALITY_SIGN ) {
      c++ ;
      this. ltraw = '>=';
    }
    else  this. ltraw = '>';
  }
  this.c=c;
};

this.skipS = function() {
     var noNewLine = !false,
         startOffset = this.c,
         c = this.c,
         l = this.src,
         e = l.length,
         start = c;

     while ( c < e ) {
       switch ( l.charCodeAt ( c ) ) {
         case CHAR_WHITESPACE :
             while ( ++c < e &&  l.charCodeAt(c) === CHAR_WHITESPACE );
             continue ;
         case CHAR_CARRIAGE_RETURN : if ( CHAR_LINE_FEED === l.charCodeAt( c + 1 ) ) c ++;
         case CHAR_LINE_FEED :
            if ( noNewLine ) noNewLine = false ;
            start = ++ c ;
            this.li ++ ;
            this.col = ( 0)
            continue ;

         case CHAR_VTAB:
         case CHAR_TAB:
         case CHAR_FORM_FEED: c++ ; continue ;  

         case CHAR_DIV:
             switch ( l.charCodeAt ( c + ( 1) ) ) {
                 case CHAR_DIV:
                     c ++ ;
                     this.c=c;
                     this.readLineComment () ;
                     if ( noNewLine ) noNewLine = false ;
                     start = c = this.c ;
                     continue ;

                 case CHAR_MUL:
                   c +=  2 ;
                   this.col += (c-start ) ;
                   this.c = c ;
                   noNewLine = this. readMultiComment () && noNewLine ;
                   start = c = this.c ;
                   continue ;

                 default:
                     c++ ;
                     this.newLineBeforeLookAhead = ! noNewLine ;
                     this.col += (c-start ) ;
                     this.c=c ;
                     this.prec  = 0xAD ;
                     this.lttype =  '/';
                     this.ltraw = '/' ;
                     return !false;
             }

         case 0x0020:case 0x00A0:case 0x1680:case 0x2000:
         case 0x2001:case 0x2002:case 0x2003:case 0x2004:
         case 0x2005:case 0x2006:case 0x2007:case 0x2008:
         case 0x2009:case 0x200A:case 0x202F:case 0x205F:
         case 0x3000:case 0xFEFF: c ++ ; continue ;

         case 0x2028:
         case 0x2029:
            if ( noNewLine ) noNewLine = false ;
            start = ++c ;
            this.col = 0 ;
            this.li ++ ;
            continue;

         case CHAR_LESS_THAN:
            if ( this.isScript &&
                 l.charCodeAt(c+1) === CHAR_EXCLAMATION &&
                 l.charCodeAt(c+2) === CHAR_MIN &&
                 l.charCodeAt(c+ 1 + 2) === CHAR_MIN ) {
               this.c = c + 4;
               this.readLineComment();
               c = this.c;
               continue;
            }
            this.col += (c-start ) ;
            this.c=c;
            this.newLineBeforeLookAhead = !noNewLine ;
            return ;
 
         case CHAR_MIN:
            if ( (!noNewLine || startOffset === 0) &&
                 this.isScript &&
                 l.charCodeAt(c+1) === CHAR_MIN && l.charCodeAt(c+2) === CHAR_GREATER_THAN ) {
               this.c = c + 1 + 2;
               this.readLineComment();
               c = this.c;
               continue;
            }
  
         default :
   
            this.col += (c-start ) ;
            this.c=c;
            this.newLineBeforeLookAhead = !noNewLine ;
            return ;
       }
     }

  this.col += (c-start ) ;
  this.c = c ;
  this.newLineBeforeLookAhead = !noNewLine ;
};

this.readDot = function() {
   ++this.c;
   if( this.src.charCodeAt(this.c)===CHAR_SINGLEDOT) {
     if (this.src.charCodeAt(++ this.c) === CHAR_SINGLEDOT) { this.lttype = '...' ;   ++this.c; return ; }
     this.err('Unexpectd ' + this.src[this.c]) ;
   }
   else if ( Num(this.src.charCodeAt(this.c))) {
       this.lttype = 'Literal' ;
       this.c0  = this.c - 1;
       this.li0 = this.li;
       this.col0= this.col ;

       this.frac( -1 ) ;
       return;
   }
   this. ltraw = this.lttype = '.' ;
};

this.readMisc = function () { this.lttype = this.  src.   charAt (   this.c ++  )    ; };

this.expectType = function (n)  {
  this.assert(this.lttype === n, 'expected ' + n + '; got ' + this.lttype  )  ;
  this.next();
};

this.expectID = function (n) {
  this.assert(this.lttype === 'Identifier' && this.ltval === n)  ;
  this.next();
};



},
function(){
this.parseExpr = function (context) {
  var head = this.parseNonSeqExpr(PREC_WITH_NO_OP,context );

  var lastExpr;
  if ( this.lttype === ',' ) {
    context &= CONTEXT_FOR;

    var e = [core(head)] ;
    do {
      this.next() ;
      lastExpr = this.parseNonSeqExpr(PREC_WITH_NO_OP,context);
      e.push(core(lastExpr));
    } while (this.lttype === ',' ) ;

    return  { type: 'SequenceExpression', expressions: e, start: head.start, end: lastExpr.end,
              loc: { start : head.loc.start, end : lastExpr.loc.end} };
  }

  return head ;
};

this .parseCond = function(cond,context ) {
    this.next();
    var con = this. parseNonSeqExpr(PREC_WITH_NO_OP, CONTEXT_NONE ) ;
    this.expectType(':');
    var alt = this. parseNonSeqExpr(PREC_WITH_NO_OP, context ) ;
    return { type: 'ConditionalExpression', test: core(cond), start: cond.start , end: alt.end ,
             loc: { start: cond.loc.start, end: alt.loc.end }, consequent: core(con), alternate: core(alt) };
};

this .parseUnaryExpression = function(context ) {
  var u = null, startLoc = null, startc = 0;
  if ( this.isVDT ) {
    this.isVDT = false;
    u = this.ltval;
    startLoc = this.locBegin();
    startc = this.c0;
  }
  else {
    u = this.ltraw;
    startLoc = this.locOn(1);
    startc = this.c - 1;
  }

  this.next();
  var arg = this. parseNonSeqExpr(PREC_U,context|CONTEXT_UNASSIGNABLE_CONTAINER );

  return { type: 'UnaryExpression', operator: u, start: startc, end: arg.end,
           loc: { start: startLoc, end: arg.loc.end }, prefix: !false, argument: core(arg) };
};

this .parseUpdateExpression = function(arg, context) {
    var c = 0,
        loc = null,
        u = this.ltraw;

    if ( arg === null ) {
       c  = this.c-2;
       loc = this.locOn(2);
       this.next() ;
       arg = this. parseExprHead(context|CONTEXT_UNASSIGNABLE_CONTAINER );
       this.assert(arg);

       this.ensureSimpAssig(core(arg));
       return { type: 'UpdateExpression', argument: core(arg), start: c, operator: u,
                prefix: !false, end: arg.end, loc: { start: loc, end: arg.loc.end } };
    }

    this.ensureSimpAssig(core(arg));
    c  = this.c;
    loc = { start: arg.loc.start, end: { line: this.li, column: this.col } };
    this.next() ;
    return { type: 'UpdateExpression', argument: core(arg), start: arg.start, operator: u,
             prefix: false, end: c, loc: loc };

};

this .parseO = function(context ) {

    switch ( this. lttype ) {

      case 'op': return !false;
      case '--': return !false;
      case '-': this.prec = PREC_ADD_MIN; return !false;
      case '/':
           if ( this.src.charCodeAt(this.c) === CHAR_EQUALITY_SIGN ) {
             this.c++ ;
             this.prec = PREC_OP_ASSIG;
             this.ltraw = '/=';
             this.col++; 
           }
           else
              this.prec = PREC_MUL ; 

           return !false;

      case 'Identifier': switch ( this. ltval ) {
         case 'instanceof':
           this.prec = PREC_COMP  ;
           this.ltraw = this.ltval ;
           return !false;

         case 'of':
         case 'in':
            if ( context & CONTEXT_FOR ) break ;
            this.prec = PREC_COMP ;
            this.ltraw = this.ltval;
            return !false;
     }
     break;

     case '?': this .prec = PREC_COND  ; return !false;
   }

   return false ;
};

this.parseNonSeqExpr = function (prec, context  ) {
    var firstUnassignable = null, firstParen = null;

    var head = this. parseExprHead(context);

    if ( head === null ) {
         switch ( this.lttype ) {
           case 'u':
           case '-':
              head = this. parseUnaryExpression(context & CONTEXT_FOR );
              break ;

           case '--':
              head = this. parseUpdateExpression(null, context&CONTEXT_FOR );
              break ;

           case 'yield':
              this.assert(prec === PREC_WITH_NO_OP ) ; // make sure there is no other expression before it
              return this.parseYield(context); // everything that comes belongs to it
   
           default:
              this.assert(context & CONTEXT_NULLABLE )  ; 
              return null;
         }
    }
    else if ( prec === PREC_WITH_NO_OP ) {
      firstParen = head. type === PAREN ? head.expr : this.firstParen ;      
      firstUnassignable = this.firstUnassignable;
    }   

    var op = false;
    while ( !false ) {
       op = this. parseO( context );
       if ( op && isAssignment(this.prec) ) {
         this.assert( prec === PREC_WITH_NO_OP );
         this.firstUnassignable = firstUnassignable;
         head = this. parseAssignment(head, context );
         break ;
       }
       else {
         this.assert( !this.unsatisfiedArg ); 

         if ( this.firstEA )
            this.assert( (context & CONTEXT_ELEM_OR_PARAM) && !op );

         if ( this.unsatisfiedAssignment ) {
            this.assert(prec===PREC_WITH_NO_OP && (context & CONTEXT_ELEM_OR_PARAM ) );
            break ;
         }
         if ( !op ) break;
       }

       if ( isMMorAA(this.prec) ) {
         if ( this. newLineBeforeLookAhead )
           break ;
         head = this. parseUpdateExpression(head, context & CONTEXT_FOR ) ;
         continue;
       }
       if ( isQuestion(this.prec) ) {
          if ( prec === PREC_WITH_NO_OP ) {
            head = this. parseCond(head, context&CONTEXT_FOR );
          }
          break ;
       }

       if ( this. prec < prec ) break ;
       if ( this. prec  === prec && !isRassoc(prec) ) break ;

       var o = this.ltraw;
       var currentPrec = this. prec;
       this.next();
       var right = this.parseNonSeqExpr(currentPrec, (context & CONTEXT_FOR)|CONTEXT_UNASSIGNABLE_CONTAINER );
       head = { type: !isBin(currentPrec )  ? 'LogicalExpression' :   'BinaryExpression',
                operator: o,
                start: head.start,
                end: right.end,
                loc: {
                   start: head.loc.start,
                   end: right.loc.end
                },
                left: core(head),
                right: core(right)
              };
    }
  
    if ( prec === PREC_WITH_NO_OP ) {
      this.firstParen = firstParen ;
      this.firstUnassignable = firstUnassignable;
    }

    return head;
};



},
function(){
this.readNumberLiteral = function (peek) {
  var c = this.c, src = this.src, len = src.length;
  var b = 10 , val = 0;
  this.lttype  = 'Literal' ;
  this.li0 = this.li ;
  this.col0 = this.col;
  this.c0 = this.c;

  if (peek === CHAR_0) { // if our num lit starts with a 0
    b = src.charCodeAt(++c);
    switch (b) { // check out what the next is
      case CHAR_X: case CHAR_x:
         c++;
         this.assert(c < len);
         b = src.charCodeAt(c);
         this.assert( isHex(b) );
         c++;
         while ( c < len && isHex( b = src.charCodeAt(c) ) )
             c++ ;
         this.ltval = parseInt( this.ltraw = src.slice(this.c,c) ) ;
         this.c = c;
         return;

      case CHAR_B: case CHAR_b:
        ++c;
        this.assert(c < len);
        b = src.charCodeAt(c);
        this.assert( b === CHAR_0 || b === CHAR_1 );
        val = b - CHAR_0; 
        ++c;
        while ( c < len &&
              ( b = src.charCodeAt(c), b === CHAR_0 || b === CHAR_1 ) ) {
           val <<= 1;
           val |= b - CHAR_0; 
           c++ ;
        }
        this.ltval = val ;
        this.ltraw = src.slice(this.c,c);
        this.c = c;
        return;

      case CHAR_O: case CHAR_o:
        ++c;
        this.assert(c < len) ; 
        b = src.charCodeAt(c);
        this.assert( b >= CHAR_0 && b < CHAR_8 );
        val = b - CHAR_0 ;
        ++c; 
        while ( c < len &&
              ( b = src.charCodeAt(c), b >= CHAR_0 && b < CHAR_8 ) ) {
           val <<= (1 + 2);
           val |= b - CHAR_0;
           c++ ;
        } 
        this.ltval = val ;
        this.ltraw = src.slice(this.c,c) ;
        this.c = c;
        return;

      default:
        if ( b >= CHAR_0 && b <= CHAR_9 ) {
          this.assert( !this.tight );
          var base = 8;
          do {
            if ( b >= CHAR_8 && base === 8 ) base = 10 ;
            c ++;
          } while ( c < len &&
                  ( b = src.charCodeAt(c), b >= CHAR_0 && b <= CHAR_9) );
          
          b = this.c;
          this.c = c; 
  
          if ( this.frac(b) ) return;

          this.ltval = parseInt (this.ltraw = src.slice(b, c), base);
          return ;
       }
       else {
         b = this.c ;
         this.c = c ;
         if ( this.frac(b) ) return;
         else  {
            this.ltval = 0;
            this.ltraw = '0';
         }
         return  ;
       }
    }
  }

  else  {
    b = this.c;
    c ++ ;
    while (c < len && num(src.charCodeAt(c))) c++ ;
    this.c = c;
    if ( this.frac(b) )
       return;
    else
       this.ltval = parseInt(this.ltraw = src.slice(b, this.c)  ) ;

    this.c = c;
  }
  
  this.assert ( !( c < len && isIDHead(src.charCodeAt(c))) ); // needless
};

this . frac = function(n) {
  var c = this.c,
      l = this.src,
      e = l.length ;
  if ( n === -1 || l.charCodeAt(c)=== CHAR_SINGLEDOT )
     while( ++c < e && Num(l.charCodeAt (c)))  ;

  switch(l.charCodeAt(c)){
      case CHAR_E:
      case CHAR_e:
        c++;
        switch(l.charCodeAt(c)){case CHAR_MIN: case CHAR_ADD: c++ ; }
        while ( c < e && Num(l.charCodeAt( c) )) c++ ;
  }
  if ( c === this.c ) return false  ;
  this.ltraw = l.slice (n === -1 ? this.c - 1 : n, c);
  this.ltval =  parseFloat(this.ltraw )  ;
  this.c = c ;
  return ! false   ;
}



},
function(){

this .parseMeth = function(name, isClass) {
   var val = null; 

   if ( !isClass ) {
     val = this.parseFunc(CONTEXT_NONE,ARGLIST_AND_BODY,ANY_ARG_LEN );
     return { type: 'Property', key: core(name), start: name.start, end: val.end,
              kind: 'init', computed: name.type === PAREN,
              loc: { start: name.loc.start, end : val.loc.end },
              method: !false, shorthand: false, value : val };
   }

   var kind = 'method' ;

   switch ( name.type ) {
     case 'Identifier':
         if ( name.name === 'constructor' )  kind  = 'constructor';
         break ;

     case 'Literal':
         if ( name.value === 'constructor' )  kind  = 'constructor';
         break ;
   }

   val = this.parseFunc(CONTEXT_NONE ,
      ARGLIST_AND_BODY|(kind !== 'constructor' ? METH_FUNCTION : CONSTRUCTOR_FUNCTION), ANY_ARG_LEN ); 

   return { type: 'MethodDefinition', key: core(name), start: name.start, end: val.end,
            kind: kind, computed: name.type === PAREN,
            loc: { start: name.loc.start, end: val.loc.end },
            value: val,    'static': false };
};

this .parseGen = function(isClass ) {
  var startc = this.c - 1,
      startLoc = this.locOn(1);
  this.next();
  var name = null;

  switch ( this.lttype ) {
     case 'Identifier':
        this.assert(this.ltval !== 'constructor' ) ;
        name = this.memberID();
        break ;

     case '[':
        name = this.memberExpr();
        break ;

     case 'Literal' :
        this.assert(this.ltval !== 'constructor' ) ;
        name = this.numstr();
        break ;

     default:
        this.assert(false);
  }

  var val = null;

  if ( !isClass ) {
     val  =  this.parseFunc ( CONTEXT_NONE, ARGLIST_AND_BODY_GEN, ANY_ARG_LEN );

     return { type: 'Property', key: core(name), start: startc, end: val.end,
              kind: 'init', computed: name.type === PAREN,
              loc: { start: startLoc , end : val.loc.end },
              method: !false, shorthand: false, value : val };
  }

  val = this.parseFunc(  CONTEXT_NONE , ARGLIST_AND_BODY_GEN|METH_FUNCTION, ANY_ARG_LEN )
  return { type: 'MethodDefinition', key: core(name), start: startc, end: val.end,
           kind: 'method', computed: name.type === PAREN,
           loc : { start: startLoc, end: val.loc.end },    'static': false, value: val };
};

this . parseSetGet= function(isClass) {
  var startc = this.c0,
      startLoc = this.locBegin();

  var c = this.c, li = this.li, col = this.col;

  var kind = this.ltval;
  this.next();

  var strName = null;
  var name = null;

  switch ( this.lttype ) {
      case 'Identifier':
         if (!!isClass) strName = this.ltval;
         name = this.memberID();
         break;
      case '[':
         name = this.memberExpr();
         break;
      case 'Literal':
         if (!!isClass) strName = this.ltval;
         name = this.numstr();
         break ;
      default:  
           name = { type: 'Identifier', name: this.ltval, start: startc,  end: c,
                   loc: { start: startLoc, end: { line: li, column: col } } };

           return !isClass ? this.parseProperty(name) : this.parseMeth(name, !isClass) ;
  }

  var val = null;
  if ( !isClass ) {
       val = this.parseFunc ( CONTEXT_NONE, ARGLIST_AND_BODY, kind === 'set' ? 1 : 0 ); 
       return { type: 'Property', key: core(name), start: startc, end: val.end,
             kind: kind, computed: name.type === PAREN,
             loc: { start: startLoc, end: val.loc.end }, method: false,
             shorthand: false, value : val };
  }
  
  val = this.parseFunc ( CONTEXT_NONE , ARGLIST_AND_BODY|METH_FUNCTION, kind === 'set' ? 1 : 0 )
  this.assert ( strName !== 'constructor' );

  return { type: 'MethodDefinition', key: core(name), start: startc, end: val.end,
           kind: kind, computed: name.type === PAREN,
           loc : { start: startLoc, end: val.loc.end }, 'static': false, value: val };
};



},
function(){
this.parseObjectExpression = function (context) {
  var startc = this.c - 1 ,
      startLoc = this.locOn(1),
      elem = null,
      list = [];

  var firstUnassignable = null, firstParen = null, 
      unsatisfiedAssignment = this.unsatisfiedAssignment;

  var first__proto__ = null;
  var firstEA = null;

  var firstElemWithYS = null;
  var parenYS = null;

  var firstYS = this.firstYS;

  if ( context & CONTEXT_UNASSIGNABLE_CONTAINER ) 
    context = context & CONTEXT_PARAM;

  else
    context = context & CONTEXT_PARAM|CONTEXT_ELEM;

  do {
     this.next();
     this.unsatisfiedAssignment = null;
  
     this.first__proto__ = first__proto__;
     this.firstEA = null;
     this.firstElemWithYS = null;

     elem = this.parseProperty(null,context);
     if ( !first__proto__ && this.first__proto__ )
          first__proto__ =  this.first__proto__ ;

     if ( !firstEA && this.firstEA )
           firstEA =  this.firstEA ;

     if ( (context & CONTEXT_PARAM) && !firstElemWithYS && this.firstElemWithYS ) {
       parenYS = this.parenYS;
       firstElemWithYS = this.firstElemWithYS;
     }

     if ( elem ) {
       list.push(elem);
       if (!unsatisfiedAssignment && this.unsatisfiedAssignment ) {
           this.assert( context & CONTEXT_ELEM );
           unsatisfiedAssignment =  this.unsatisfiedAssignment ;
       }
       
       if ( !firstParen && this.firstParen )
             firstParen =  this.firstParen ;

       if ( !firstUnassignable && this.firstUnassignable )
             firstUnassignable =  this.firstUnassignable ;

       if ( !firstYS && this.firstYS )
         firstYS = this.firstYS;

     }
     else
        break ;

  } while ( this.lttype === ',' );

  elem = { properties: list, type: 'ObjectExpression', start: startc,
     end: this.c , loc: { start: startLoc, end: this.loc() }};

  this.expectType('}');

  if ( firstUnassignable ) this.firstUnassignable = firstUnassignable;
  if ( firstParen ) this.firstParen = firstParen;
  if ( firstEA ) this.firstEA = firstEA;
  if ( firstElemWithYS ) {
     this.parenYS = parenYS;
     this.firstElemWithYS = firstElemWithYS;  
  }
     
  if ( unsatisfiedAssignment )
     this.unsatisfiedAssignment = unsatisfiedAssignment ;

  this.firstYS = firstYS;

  return elem;
};

this.parseProperty = function (name, context) {

  var __proto__ = false, first__proto__ = this.first__proto__ ;
  var val = null;
  

  SWITCH:
  if ( name === null ) switch ( this.lttype  ) {
      case 'op':
         return this.ltraw === '*' ? this.parseGen(OBJ_MEM) : null;

      case 'Identifier': switch ( this.ltval ) {
         case 'get':
            return this.parseSetGet(OBJ_MEM);
         case 'set':
            return this.parseSetGet(OBJ_MEM);

         case '__proto__':
            __proto__ = !false;

         default:
            name = this.memberID();
            break SWITCH;
      }
      case 'Literal':
            if ( this.ltval === '__proto__' )
               __proto__ = !false;
 
            name = this.numstr();
            break SWITCH;

      case '[':
            name = this.memberExpr();
            break SWITCH;

      default: return null;
  }

  this.firstUnassignable = this.firstParen = null;

  switch (this.lttype) {
      case ':':
         this.assert( !( __proto__ && first__proto__ ) ) ;

         this.next();
         val = this.parseNonSeqExpr ( PREC_WITH_NO_OP, context )  ;
         val = { type: 'Property', start: name.start, key: core(name), end: val.end,
                  kind: 'init', loc: { start: name.loc.start, end: val.loc.end }, computed: name.type === PAREN ,
                  method: false, shorthand: false, value: core(val) };
         if ( __proto__ )
            this.first__proto__ = val;

         return val;

      case '(':
         return this.parseMeth(name, OBJ_MEM);

      default:
          this.assert(name.type === 'Identifier' ) ;
          if ( this.lttype === 'op' ) {
             this.assert(this.ltraw === '=' );
             this.assert(context & CONTEXT_ELEM );
             val = this.parseAssig(name);
             this.unsatisfiedAssignment = val;
          }
          else
             val = name;

          return { type: 'Property', key: name, start: val.start, end: val.end,
                    loc: val.loc, kind: 'init',  shorthand: !false, method: false,
                   value: val, computed: false };
  }

       return n   ;
};



},
function(){

this.parsePattern = function() {
  switch ( this.lttype ) {
    case 'Identifier' :
       var id = this.validateID(null);
       if ( this.isInArgList ) 
          this.addArg(id);
 
       return id;

    case '[':
       return this.parseArrayPattern();
    case '{':
       return this.parseObjectPattern();

    default:
       return null;
  }
};

this. parseArrayPattern = function() {
  var startc = this.c - 1,
      startLoc = this.locOn(1),
      elem = null,
      list = [];

  if ( this.isInArgList ) {
     this.inComplexArgs = !false;
  }

  this.next();
  while ( !false ) {
      elem = this.parsePattern();
      if ( elem ) {
         if ( this.lttype === 'op' && this.ltraw === '=' ) elem = this.parseAssig(elem);
      }
      else {
         if ( this.lttype === '...' ) {
           list.push(this.parseRestElement());
           break ;
         }  
      }
    
      if ( this.lttype === ',' ) {
         list.push(elem);
         this.next();
      }       
      else  {
         if ( elem ) list.push(elem);
         break ;
      }
  } 

  if ( this.isInArgList )
       this.inComplexArgs = this.tight;

  elem = { type: 'ArrayPattern', loc: { start: startLoc, end: this.loc() },
           start: startc, end: this.c, elements : list};

  this. expectType ( ']' ) ;

  return elem;
};

this.parseObjectPattern  = function() {

    var sh = false;
    var startc = this.c-1;
    var startLoc = this.locOn(1);
    var list = [];
    var val = null;
    var name = null;

    if ( this.isInArgList ) {
         this.inComplexArgs = !false;
    }

    LOOP:
    do {
      sh = false;
      this.next ()   ;
      switch ( this.lttype ) {
         case 'Identifier':
            name = this.memberID();
            if ( this.lttype === ':' ) {
              this.next();
              val = this.parsePattern()
            }
            else { sh = !false; val = name; }
            break ;

         case '[':
            name = this.memberExpr();
            this.expectType(':');
            val = this.parsePattern();
            break ;

         case 'Literal':
            name = this.numstr();
            this.expectType(':');
            val = this.parsePattern();
            break ;

         default:
            break LOOP;
      }
      if ( this.lttype === 'op' && this.ltraw === '=' )
        val = this.parseAssig(val);

      list.push({ type: 'Property', start: name.start, key: core(name), end: val.end,
                  loc: { start: name.loc.start, end: val.loc.end },
                 kind: 'init', computed: name.type === PAREN, value: val,
               method: false, shorthand: sh });

    } while ( this.lttype === ',' );

    if ( this.isInArgList  )
         this.inComplexArgs = this.tight; 

    var n = { type: 'ObjectPattern',
             loc: { start: startLoc, end: this.loc() },
             start: startc,
              end: this.c,
              properties: list };

    this.expectType('}');

    return n;
};

this .parseAssig = function (head) {
    this.next() ;
    var e = this.parseNonSeqExpr( PREC_WITH_NO_OP, CONTEXT_NONE );
    return { type: 'AssignmentPattern', start: head.start, left: head, end: e.end,
           right: core(e), loc: { start: head.loc.start, end: e.loc.end } };
};


this.parseRestElement = function() {
   var startc = this.c-1-2,
       startLoc = this.locOn(1+2);

   this.next ();
   var e = this.parsePattern();
   this.assert(e);

   return { type: 'RestElement', loc: { start: startLoc, end: e.loc.end }, start: startc, end: e.end,argument: e };
};



},
function(){
this.parseExprHead = function (context) {
  var firstUnassignable = null;
  var firstParen = null;

  var head = null;
  var inner = null;
  var elem = null;

  if ( this. pendingExprHead ) {
      head = this. pendingExprHead;
      this. pendingExprHead  =  null;
  }
  else switch (this.lttype)  {
        case 'Identifier':
            if ( head = this. parseIdStatementOrId(context) )
               break ;

             return null;

        case '[' :
            this.firstUnassignable = this.firstParen = null;

            head = this. parseArrayExpression(
              context & (CONTEXT_UNASSIGNABLE_CONTAINER|CONTEXT_PARAM) );
            if ( this. unsatisfiedAssignment )
               return head ;

            firstUnassignable = this.firstUnassignable;
            firstParen = this.firstParen;

            break ;

        case '(' :
            this.arrowParen = !false;
            head = this. parseParen() ;
            if ( this.unsatisfiedArg )
               return head ;

            break ;

        case '{' :
            this.firstUnassignable = this.firstParen = null;

            head = this. parseObjectExpression(
              context & (CONTEXT_UNASSIGNABLE_CONTAINER|CONTEXT_PARAM) ) ;
            if ( this.unsatisfiedAssignment )
              return head;

            firstUnassignable = this.firstUnassignable;
            firstParen = this.firstParen;

            break ;

        case '/' :
            head = this. parseRegExpLiteral () ;
            break ;

        case '`' :
            head = this. parseTemplateLiteral () ;
            break ;

        case 'Literal':
            head = this.numstr ();
            break ;

        case '-':
           this. prec = PREC_U;
           return null ;

        default: return null;

  }

  if ( this.firstEA )  switch ( this.lttype )   {
    case '.': case '(': case '[': case '`': this.assert(false) ;
  }
     
  inner = core( head ) ;

  LOOP:
  while ( !false ) {
     switch (this.lttype ) {
         case '.':
            this.next();
            elem  = this.memberID();
            this.assert(elem);
            head = {  type: 'MemberExpression', property: elem, start: head.start, end: elem.end,
                      loc: { start: head.loc.start, end: elem.loc.end }, object: inner, computed: false };
            inner =  head ;
            continue;

         case '[':
            this.next() ;
            elem   = this. parseExpr(PREC_WITH_NO_OP,CONTEXT_NONE ) ;
            head =  { type: 'MemberExpression', property: core(elem), start: head.start, end: this.c,
                      loc : { start: head.loc.start, end: this.loc()  }, object: inner, computed: !false };
            inner  = head ;
            this.expectType(']') ;
            continue;

         case '(':
            elem  = this. parseArgList() ;
            head =  { type: 'CallExpression', callee: inner , start: head.start, end: this.c,
                      arguments: elem, loc: { start: head.loc.start, end: this.loc() } };
            this.expectType(')'   )  ;
            inner = head  ;
            continue;

          case '`' :
            elem = this. parseTemplateLiteral();
            head = {
                  type : 'TaggedTemplateExpression',
                  quasi : elem,
                  start: head.start,
                   end: elem.end,
                  loc : { start: head.loc.start, end: elem.loc.end },
                  tag : inner
             };
 
             inner = head;
             continue ;

          default: break LOOP;
     }

  }

  if ( head.type !== PAREN ) { 
     this.firstUnassignable = firstUnassignable;
     this.firstParen = firstParen;
  }

  return head ;
} ;

this .parseMeta = function(startc,end,startLoc,endLoc,new_raw ) {
    this.assert( this.ltval === 'target' );
    var prop = this.id();
    return { type: 'MetaProperty',
             meta: { type: 'Identifier', name : 'new', start: startc, end: end, loc: { start : startLoc, end: endLoc }, raw: new_raw  },
             start : startc,
             property: prop, end: prop.end,
             loc : { start: startLoc, end: prop.loc.end } };

};

this.numstr = function () {
  var n = { type: 'Literal', value: this.ltval, start: this.c0, end: this.c,
           loc: { start: this.locBegin(), end: this.loc() }, raw: this.ltraw };
  this.next();
  return n;
};

this.idLit = function(val) {
  var n = { type: 'Literal', value: val, start: this.c0, end: this.c,
           loc: { start: this.locBegin(), end: this.loc() }, raw: this.ltraw };
  this.next();
  return n;
};

this.id = function() {
   var id = { type: 'Identifier', name: this.ltval, start: this.c0, end: this.c,
              loc: { start: this.locBegin(), end: this.loc() }, raw: this.ltraw };
   this.next() ;
   return id;
};

this.parseParen = function () {
  var firstParen = null;
  var unsatisfiedAssignment = this.unsatisfiedAssignment,
      startc = this.c - 1 ,
      startLoc = this.locOn   (  1 )  ;

  var unsatisfiedArg = null;
  var list = null, elem = null;

  var firstElem = null;
  var firstYS = this.firstYS;

  var firstElemWithYS = null, parenYS = null;  

  var context = CONTEXT_NULLABLE;
  if ( this.arrowParen ) {
       this.arrowParen = false; 
       context |= CONTEXT_PARAM;
  }
       
  var firstEA = null;

  while ( !false ) {
     this.firstParen = null;
     this.next() ;
     this.unsatisfiedAssignment = null;
     this.firstEA = null;
     this.firstElemWithYS = null;
     elem =   // unsatisfiedArg ? this.parsePattern() :
            this.parseNonSeqExpr(PREC_WITH_NO_OP, context ) ;

     if ( !elem ) {
        if ( this.lttype === '...' ) {
           elem = this.parseSpreadElement();
           if ( !firstParen && this.firstParen ) firstParen = this.firstParen;
           if ( !firstEA && this.firstEA ) firstEA = this.firstEA;
           if ( !firstElemWithYS && this.firstYS ) {
                 firstElemWithYS = elem;
                 parenYS = this.firstYS;
           }
           if ( !unsatisfiedArg ) unsatisfiedArg = elem;
        }
        break;
     }

     if ( !firstParen && this.firstParen )
           firstParen =  this.firstParen ;

     if ( !firstEA && this.firstEA )
           firstEA =  this.firstEA ;

     if ( !firstElemWithYS && this.firstElemWithYS ) {
           parenYS = this.parenYS;
           firstElemWithYS = this.firstElemWithYS ;
     } 

     if ( !firstYS && this.firstYS ) 
       firstYS = this.firstYS;

     if ( !unsatisfiedArg && this.unsatisfiedAssignment)
           unsatisfiedArg =  this.unsatisfiedAssignment;

     if ( this.lttype !== ',' ) break ;

     if ( list ) list.push(core(elem));
     else {
       firstElem = elem;
       list = [ core(elem) ] ;
     }

  }

  // if elem is a SpreadElement, and we have a list
  if ( elem && list ) list.push(elem);

  // if we have a list, the expression in parens is a seq
  if ( list )
       elem = { type: 'SequenceExpression', expressions: list, start: firstElem .start , end: elem.end,
               loc: { start:  firstElem .loc.start , end: elem.loc.end } };
  // otherwise update the expression's paren depth if it's needed
  if ( elem ) {
    elem = core(elem); 
    switch (  elem.type ) {
       case 'Identifier': case 'MemberExpression':
          this.firstUnassignable = null;
          break ;

       default:
          this.firstUnassignable = elem; 
    }
  }

  var n = { type: PAREN, expr: elem, start: startc, end: this.c,
           loc: { start: startLoc, end: this.loc() } };

  if ( firstParen )
    this.firstParen = firstParen;

  if ( unsatisfiedArg )
     this.unsatisfiedArg = unsatisfiedArg;

  else if ( !elem ) // we got an empty paren (), which certainly is an arg list
     this.unsatisfiedArg = n;

  this.firstEA = firstEA ;
  this.unsatisfiedAssignment = unsatisfiedAssignment ;
  this.expectType(')') ;

  this.firstElemWithYS = firstElemWithYS;
  this.parenYS = parenYS;
  this.firstYS = firstYS;

  return n;
};


this .parseThis = function() {
    var n = { type : 'ThisExpression',
              loc: { start: this.locBegin(), end: this.loc() },
              start: this.c0,
              end : this.c };
    this.next() ;

    return n;
};


this.parseArgList = function () {
    var elem = null;
    var list = [];

    do { 
       this.next();
       elem = this.parseNonSeqExpr(PREC_WITH_NO_OP,CONTEXT_NULLABLE ); 
       if ( elem )
         list.push (core(elem));
       else if ( this.lttype === '...' )
         list.push(this.parseSpreadElement());
       else
         break ;
    } while ( this.lttype === ',' );

    return list ;
};



},
function(){
this.parseProgram = function () {
  var startc = this.c, li = this.li, col = this.col;
  var endI = this.c , startLoc = null;
  this.next();
  var list = this.blck(); 
  var endLoc = null;
  if (list.length) {
    var firstStatement = list[0];
    startc = firstStatement.start;
    startLoc = firstStatement.loc.start;    

    var lastStatement = list[ list.length - 1 ];
    endI = lastStatement.end;
    endLoc = lastStatement.loc.end;
  }
  else {
    endLoc = startLoc = { line: 0, column: 0 };
  }
        
  var n = { type: 'Program', body: list, start: startc, end: endI, sourceType: !this.isScript ? "module" : "script" ,
           loc: { start: startLoc, end: endLoc } };

  this.expectType('eof');

  return n;
};



},
function(){

var gRegexFlag =               1 ,
    uRegexFlag = gRegexFlag << 1 ,
    yRegexFlag = uRegexFlag << 1 ,
    mRegexFlag = yRegexFlag << 1 ,
    iRegexFlag = mRegexFlag << 1 ;

var regexFlagsSupported = 0;

try {
   new RegExp ( "lube", "g" ) ; regexFlagsSupported |= gRegexFlag ;
   new RegExp ( "lube", "u" ) ; regexFlagsSupported |= uRegexFlag ;
   new RegExp ( "lube", "y" ) ; regexFlagsSupported |= yRegexFlag ;
   new RegExp ( "lube", "m" ) ; regexFlagsSupported |= mRegexFlag ;
   new RegExp ( "lube", "i" ) ; regexFlagsSupported |= iRegexFlag ;
}
catch(r) {
}

function curlyReplace(matchedString, b, matchIndex, wholeString ) {
  var c = parseInt( '0x' + b );
  if ( c <= 0xFFFF ) return '\\u' + hex(c);
  return '\\uFFFF';
}

function regexReplace(matchedString, b, noB, matchIndex, wholeString) {
  var c = parseInt('0x' + ( b || noB ) ) ;
  this.assert(c <= 0x010FFFF );
  
  if ( c <= 0xFFFF ) return String.fromCharCode(c) ;

  c -= 0x010000;
  return '\uFFFF';
} 

function verifyRegex(regex, flags) {
  var regexVal = null;

  try {
    return new RegExp(regex, flags);
  } catch ( e ) { throw e; }

}

this.parseRegExpLiteral = function() {
     var startc = this.c - 1, startLoc = this.locOn(1),
         c = this.c, src = this.src, len = src.length;

     var inSquareBrackets = false ;
     WHILE:
     while ( c < len ) {
       switch ( src.charCodeAt(c) ) {
         case CHAR_LSQBRACKET:
            if ( !inSquareBrackets )
               inSquareBrackets = !false;

            break;

         case CHAR_BACK_SLASH:
            ++c;
            break;

         case CHAR_RSQBRACKET:
            if ( inSquareBrackets )
               inSquareBrackets = false;

            break;

         case CHAR_DIV :
            if ( inSquareBrackets )
               break;

            break WHILE;

//       default:if ( o >= 0x0D800 && o <= 0x0DBFF ) { this.col-- ; }
       }

       c++ ;
     }

     this.assert( src.charCodeAt(c) === CHAR_DIV );
     var flags = 0;
     var flagCount = 0;
     WHILE:
     while ( flagCount <= 5 ) {
        switch ( src.charCodeAt ( ++c ) ) {
            case CHAR_g: this.assert(!(flags & gRegexFlag)); flags |= gRegexFlag; break;
            case CHAR_u: this.assert(!(flags & uRegexFlag)); flags |= uRegexFlag; break;
            case CHAR_y: this.assert(!(flags & yRegexFlag)); flags |= yRegexFlag; break;
            case CHAR_m: this.assert(!(flags & mRegexFlag)); flags |= mRegexFlag; break;
            case CHAR_i: this.assert(!(flags & iRegexFlag)); flags |= iRegexFlag; break;

            default : break WHILE;
        }

        flagCount++ ;
     }
     var patternString = src.slice(this.c, c-flagCount-1 ), flagsString = src .slice(c-flagCount,c);
     var val = null;

     var normalizedRegex = patternString;

     // those that contain a 'u' flag need special treatment when RegExp constructor they get sent to
     // doesn't support the 'u' flag: since they can have surrogate pair sequences (which are not allowed without the 'u' flag),
     // they must be checked for having such surrogate pairs, and should replace them with a character that is valid even
     // without being in the context of a 'u' 
     if ( (flags & uRegexFlag) && !(regexFlagsSupported & uRegexFlag) )
          normalizedRegex = normalizedRegex.replace( /\\u\{([A-F0-9a-f]+)\}/g, curlyReplace) // normalize curlies
             .replace( /\\u([A-F0-9a-f][A-F0-9a-f][A-F0-9a-f][A-F0-9a-f])/g, regexReplace ) // convert u
             .replace( /[\ud800-\udbff][\udc00-\udfff]/g, '\uFFFF' );
       

     // all of the 1 bits in flags must also be 1 in the same bit index in regexsupportedFlags;
     // flags ^ rsf returns a bit set in which the 1 bits mean "this flag is either not used in flags, or yt is not supported";
     // for knowing whether the 1 bit has also been 1 in flags, we '&' the above bit set with flags; the 1 bits in the
     // given bit set must both be 1 in flags and in flags ^ rsf; that is, they are both "used" and "unsupoorted or unused",
     // which would be equal to this: [used && (unsupported || !used)] === unsopprted
     if ( flags & (regexFlagsSupported^flags) )
        verifyRegex(normalizedRegex, "");
     else
        val = verifyRegex( patternString, flagsString ) ;

     this.col += (c-this.c);
     var regex = { type: 'Literal', regex: { pattern: patternString, flags: flagsString },
                   start: startc, end: c,
                   value: val, loc: { start: startLoc, end: this.loc() } };
     this.c = c;
     this.next () ;

     return regex ;
};



},
function(){
this.semiLoc = function () {
  switch (this.lttype) {
    case ';':
       var n = this.loc();
       this.next();
       return n;

    case 'eof':
       return this.newLineBeforeLookAhead ? null : this.loc();

    case '}':
       if ( !this.newLineBeforeLookAhead )
          return this.locOn(1);
  }
  if (this.newLineBeforeLookAhead) return null;

  this.err('EOS expected; found ' + this.ltraw ) ;
};

this.semiI = function() {
   return this.lttype === ';' ? this.c : this.newLineBeforeLookAhead ? 0 : this.lttype === '}' ? this.c - 1 : this.lttype === 'eof' ? this.c : 0; };



},
function(){
this.parseStatement = function ( allowNull ) {
  var head = null, l, e ;

  switch (this.lttype) {
    case '{': return this.parseBlckStatement();
    case ';': return this.parseEmptyStatement() ;
    case 'Identifier':
       this.canBeStatement = !false;
       head = this.parseIdStatementOrId(CONTEXT_NONE);
       if ( this.foundStatement ) {
          this.foundStatement = false ;
          return head;
       }

       break ;

    case 'eof':
      this.assert(allowNull);
      return null;
  }

  this.assert(head === null) ;
  head = this.parseExpr(CONTEXT_NULLABLE) ;
  if ( !head ) {
    this.assert( allowNull, "statement must not be null" )
    return null;
  }

  if ( head.type === 'Identifier' && this.lttype === ':')
    return this.parseLabeledStatement(head, allowNull);

  this.fixupLabels(false) ;
  e  = this.semiI() || head.end;
  return {
    type : 'ExpressionStatement',
    expression : core(head),
    start : head.start,
    end : e,
    loc : { start : head.loc.start, end : this.semiLoc() || head.loc.end }
  };
};

this . findLabel = function(name) {
    return has.call(this.labels, name) ?this.labels[name]:null;

};

this .parseLabeledStatement = function(label, allowNull) {
   this.next();
   var l = label.name;
   l += '%';
   this.assert( !this.findLabel(l) );
   this.labels[l] =
        this.unsatisfiedLabel ?
        this.unsatisfiedLabel :
        this.unsatisfiedLabel = { loop: false };

   var stmt  = this.parseStatement(allowNull);
   this.labels[l] = null;

   return { type: 'LabeledStatement', label: label, start: label.start, end: stmt.end,
            loc: { start: label.loc.start, end: stmt.loc.end }, body: stmt };
};

this .ensureStmt = function() {
   if ( this.canBeStatement ) this.canBeStatement = false;
   else this.assert(false);
};

this . fixupLabels = function(loop) {
    if ( this.unsatisfiedLabel ) {
         this.unsatisfiedLabel.loop = loop;
         this.unsatisfiedLabel = null;
    }
};

this .parseEmptyStatement = function() {
  var n = { type: 'EmptyStatement',
           start: this.c - 1,
           loc: { start: this.locOn(1), end: this.loc() },
            end: this.c };
  this.next();
  return n;
};

this.parseIfStatement = function () {
  this.ensureStmt ();
  this.fixupLabels(false);

  var startc = this.c0,
      startLoc  = this.locBegin();
  this.next () ;
  this.expectType('(');
  var cond = core( this.parseExpr(CONTEXT_NONE) );
  this.expectType(')' );
  var scopeFlags = this.scopeFlags ;
  this.scopeFlags |= SCOPE_BREAK; 
  var nbody = this. parseStatement (false);
  this.scopeFlags = scopeFlags ;
  var alt = null;
  if ( this.lttype === 'Identifier' && this.ltval === 'else') {
     this.next() ;
     alt = this.parseStatement(!false);
  }

  this.foundStatement = !false;
  return { type: 'IfStatement', test: cond, start: startc, end: (alt||nbody).end,
     loc: { start: startLoc, end: (alt||nbody).loc.end }, consequent: nbody, alternate: alt };
};

this.parseWhileStatement = function () {
   this.ensureStmt();
   this.fixupLabels(!false);

   var startc = this.c0,
       startLoc = this.locBegin();
   this.next();
   this.expectType('(');
   var cond = core( this.parseExpr(CONTEXT_NONE) );
   this.expectType(')');
   var scopeFlags = this.scopeFlags;
   this.scopeFlags |= (SCOPE_CONTINUE|SCOPE_BREAK );
   var nbody = this.parseStatement(false);
   this.scopeFlags = scopeFlags ;
   this.foundStatement = !false;

   return { type: 'WhileStatement', test: cond, start: startc, end: nbody.end,
       loc: { start: startLoc, end: nbody.loc.end }, body:nbody };
};

this.parseBlckStatement = function () {
  this.fixupLabels(false);
  var startc = this.c - 1,
      startLoc = this.locOn(1);
  this.next();
  var n = { type: 'BlockStatement', body: this.blck(), start: startc, end: this.c,
        loc: { start: startLoc, end: this.loc() } };

  this.expectType('}' );
  return n;
};

this.parseDoWhileStatement = function () {
  this.ensureStmt () ;
  this.fixupLabels(!false);

  var startc = this.c0,
      startLoc = this.locBegin() ;
  this.next() ;
  var scopeFlags = this.scopeFlags;
  this.scopeFlags |= (SCOPE_BREAK| SCOPE_CONTINUE);
  var nbody = this.parseStatement (!false) ;
  this.scopeFlags = scopeFlags;
  this.expectID('while');
  this.expectType('(');
  var cond = core(this.parseExpr(CONTEXT_NONE));
  var c = this.c, li = this.li, col = this.col;
  this.expectType(')');
  if (this.lttype === ';' ) {
     c = this.c;
     li = this.li ;
     col = this.col;
     this.next();
  }

 this.foundStatement = !false;
 return { type: 'DoWhileStatement', test: cond, start: startc, end: c,
          body: nbody, loc: { start: startLoc, end: { line: li, column: col } } } ;
};

this.parseContinueStatement = function () {
   this.ensureStmt   () ;
   this.fixupLabels(false);
   this.assert(this.scopeFlags & SCOPE_CONTINUE );

   var startc = this.c0, startLoc = this.locBegin();
   var c = this.c, li = this.li, col = this.col;

   this.next() ;

   var name = null, label = null, semi = 0;

   if ( !this.newLineBeforeLookAhead && this.lttype === 'Identifier' ) {
       label = this.validateID(null);
       name = this.findLabel(label.name + '%');
       this.assert(name && name.loop) ;
       semi = this.semiI();
       this.foundStatement = !false;
       return { type: 'ContinueStatement', label: label, start: startc, end: semi || label.end,
           loc: { start: startLoc, end: this.semiLoc() || label.loc.end } };
   }
   semi = this.semiI();
   this.foundStatement = !false;
   return { type: 'ContinueStatement', label: null, start: startc, end: semi || c,
           loc: { start: startLoc, end: this.semiLoc() || { line: li, column : col } } };
};

this.parseBreakStatement = function () {
   this.ensureStmt   () ;
   this.fixupLabels(false);
   this.assert(this.scopeFlags & SCOPE_BREAK);

   var startc = this.c0, startLoc = this.locBegin();
   var c = this.c, li = this.li, col = this.col;

   this.next() ;

   var name = null, label = null, semi = 0;

   if ( !this.newLineBeforeLookAhead && this.lttype === 'Identifier' ) {
       label = this.validateID(null);
       name = this.findLabel(label.name + '%');
       this.assert(name) ;
       semi = this.semiI();
       this.foundStatement = !false;
       return { type: 'BreakStatement', label: label, start: startc, end: semi || label.end,
           loc: { start: startLoc, end: this.semiLoc() || label.loc.end } };
   }
   semi = this.semiI();
   this.foundStatement = !false;
   return { type: 'BreakStatement', label: null, start: startc, end: semi || c,
           loc: { start: startLoc, end: this.semiLoc() || { line: li, column : col } } };
};

this.parseSwitchStatement = function () {
  this.ensureStmt();
  this.fixupLabels(false) ;

  var startc = this.c0,
      startLoc = this.locBegin(),
      cases = [],
      hasDefault = false ,
      scopeFlags = this.scopeFlags,
      elem = null;

  this.next() ;
  this.expectType('(');
  var switchExpr = core(this.parseExpr(CONTEXT_NONE));
  this.expectType (')');
  this.expectType('{');
  this.scopeFlags |=  SCOPE_BREAK;
  while ( elem = this.parseSwitchCase()) {
    if (elem.test === null) {
       this.assert(!hasDefault);
       hasDefault = !false ;
    }
    cases.push(elem);
  }

  this.scopeFlags = scopeFlags ;
  this.foundStatement = !false;
  var n = { type: 'SwitchStatement', cases: cases, start: startc, discriminant: switchExpr,
            end: this.c, loc: { start: startLoc, end: this.loc() } };
  this.expectType ('}' ) ;

  return n;
};

this.parseSwitchCase = function () {
  var startc,
      startLoc;

  var nbody = null,
      cond  = null;

  if ( this.lttype === 'Identifier' ) switch ( this.ltval ) {
     case 'case':
       startc = this.c0;
       startLoc = this.locBegin();
       this.next();
       cond = core(this.parseExpr(CONTEXT_NONE)) ;
       break;

     case 'default':
       startc = this.c0;
       startLoc = this.locBegin();
       this.next();
       break ;

     default: return null;
  }
  else
     return null;

  var c = this.c, li = this.li, col = this.col;
  this.expectType (':');
  nbody = this.blck();
  var last = nbody.length ? nbody[nbody.length-1] : null;
  return { type: 'SwitchCase', test: cond, start: startc, end: last ? last.end : c,
     loc: { start: startLoc, end: last ? last.loc.end : { line: li, column: col } }, consequent: nbody };
};

this.parseReturnStatement = function () {
  this.ensureStmt();
  this.fixupLabels(false ) ;

  this.assert( this.scopeFlags & SCOPE_FUNCTION );

  var startc = this.c0,
      startLoc = this.locBegin(),
      retVal = null,
      li = this.li,
      c = this.c,
      col = this.col;

  this.next();

  var semi;
  if ( !this.newLineBeforeLookAhead )
     retVal = this.parseExpr(CONTEXT_NULLABLE);

  semi = this.semiI();
  if ( retVal ) {
     this.foundStatement = !false;
     return { type: 'ReturnStatement', argument: core(retVal), start: startc, end: semi || retVal.end,
        loc: { start: startLoc, end: this.semiLoc() || retVal.loc.end } }
  }

  this.foundStatement = !false;
  return {  type: 'ReturnStatement', argument: retVal, start: startc, end: semi || c,
     loc: { start: startLoc, end: this.semiLoc() || { line: li, column : col } } };
};

this.parseThrowStatement = function () {
  this.ensureStmt();
  this.fixupLabels(false ) ;

  var startc = this.c0,
      startLoc = this.locBegin(),
      retVal = null,
      li = this.li,
      c = this.c,
      col = this.col;

  this.next();

  var semi;
  this.assert ( !this.newLineBeforeLookAhead );
  retVal = this.parseExpr(CONTEXT_NULLABLE );

  semi = this.semiI();
  if ( retVal ) {
     this.foundStatement = !false;
     return { type: 'ThrowStatement', argument: core(retVal), start: startc, end: semi || retVal.end,
        loc: { start: startLoc, end: this.semiLoc() || retVal.loc.end } }
  }

  this.foundStatement = !false;
  return {  type: 'ThrowStatement', argument: null, start: startc, end: semi || c,
     loc: { start: startLoc, end: this.semiLoc() || { line: li, column : col } } };
};

this. parseBlockStatement_dependent = function() {
    var startc = this.c - 1,
        startLoc = this.locOn(1);
    this.expectType ('{');
    var n = { type: 'BlockStatement', body: this.blck(), start: startc, end: this.c,
        loc: { start: startLoc, end: this.loc() } };
    this.expectType ('}');
    return n;
};

this.parseTryStatement = function () {
  this.ensureStmt() ;
  this.fixupLabels(false);
  var startc = this.c0,
      startLoc = this.locBegin();

  this.next() ;
  var tryBlock = this.parseBlockStatement_dependent();
  var finBlock = null, catBlock  = null;
  if ( this.lttype === 'Identifier' && this.ltval === 'catch')
    catBlock = this.parseCatchClause();

  if ( this.lttype === 'Identifier' && this.ltval === 'finally') {
     this.next();
     finBlock = this.parseBlockStatement_dependent();
  }

  var finOrCat = finBlock || catBlock;
  this.assert(finOrCat);

  this.foundStatement = !false;
  return  { type: 'TryStatement', block: tryBlock, start: startc, end: finOrCat.end,
            handler: catBlock, finalizer: finBlock, loc: { start: startLoc, end: finOrCat.loc.end } };
};

this. parseCatchClause = function () {
   var startc = this.c0,
       startLoc = this.locBegin();

   this.next();
   this.expectType('(');
   var catParam = this.parsePattern();
   this.expectType(')');
   var catBlock = this.parseBlockStatement_dependent();
   return {
       type: 'CatchClause',
        loc: { start: startLoc, end: catBlock.loc.end },
       start: startc,
       end: catBlock.end,
       param: catParam ,
       body: catBlock
   };
};

this . parseWithStatement = function() {
   this.ensureStmt() ;
   this.fixupLabels(false);

   var startc = this.c0,
       startLoc = this.locBegin();

   this.next();
   this.expectType('(');
   var obj = this.parseExpr(CONTEXT_NONE);
   this.expectType(')' );
   var nbody = this.parseStatement(!false);

   this.foundStatement = !false;
   return  {
       type: 'WithStatement',
       loc: { start: startLoc, end: nbody.loc.end },
       start: startc,
       end: nbody.end,
       object: obj, body: nbody
   };
};

this . prseDbg = function () {
  this.ensureStmt() ;
  this.fixupLabels(false);

  var startc = this.c0,
      startLoc = this.locBegin();
  var c = this.c, li = this.li, col = this.col;

  this.next() ;
  if ( this. lttype ===  ';' ) {
    c = this.c;
    li = this.li;
    col = this.col;
    this.next();
  }
  this.foundStatement = !false;
  return {
     type: 'DebuggerStatement',
      loc: { start: startLoc, end: { line: li, column: col } } ,
     start: startc,
     end: c
   };
}

this.blck = function () { // blck ([]stmt)
  var stmts = [], stmt;
  while (stmt = this.parseStatement(!false)) stmts.push(stmt);
  return (stmts);
};



},
function(){
this.readStrLiteral = function (start) {
  this.li0 = this.li;
  this.col0 = this.col;
  this.c0 = this.c ;
  var c = this.c += 1,
      l = this.src,
      e = l.length,
      i = 0,
      v = "",
      v_start = c,
      startC =  c-1;

  while (c < e && (i = l.charCodeAt(c)) !== start) {
    switch ( i ) {
     case CHAR_BACK_SLASH :
        v  += l.slice(v_start,c );
        this.col += ( c - startC ) ;
        startC =  this.c = c;
        v  += this.readEsc()  ;
        c  = this.c;
        if ( this.col === 0 ) startC = c   +  1   ;
        else  { this.col += ( c - startC  )  ; startC = c ;   }
        v_start = ++c ;
        continue ;

     case CHAR_CARRIAGE_RETURN: if ( l.charCodeAt(c + 1 ) === CHAR_LINE_FEED ) c++ ;
     case CHAR_LINE_FEED :
     case 0x2028 :
     case 0x2029 : this.err( 'a newline can not appear in a str literal' ) ;
    }
    c++;
  }

  if ( v_start !== c ) { v += l.slice(v_start,c ) ; }
  if (!(c < e && (l.charCodeAt(c)) === start)) { this.err('s lit open'); }
  this.c = c + 1 ;
  this.col += (this. c - startC   )  ;
  this.lttype = 'Literal'  ;
  this.ltraw =  l.slice (this.c0, this.c);
  this.ltval = v ;
};



},
function(){
this . parseTemplateLiteral = function() {
  var li = this.li, col = this.col;
  var startc = this.c - 1, startLoc = this.locOn(1);
  var c = this.c, src = this.src, len = src.length;
  var templStr = [], templExpressions = [];
  var startElemFragment = c, // an element's content might get fragmented by an esc appearing in it, e.g., 'eeeee\nee' has two fragments, 'eeeee' and 'ee'
      startElem = c,
      currentElemContents = "",
      startColIndex = c ,
      ch = 0;
 
  while ( c < len ) {
    ch = src.charCodeAt(c);
    if ( ch === CHAR_BACKTICK ) break; 
    switch ( ch ) {
       case CHAR_$ :
          if ( src.charCodeAt(c+1) === CHAR_LCURLY ) {
              currentElemContents += src.slice(startElemFragment, c) ;
              this.col += ( c - startColIndex );
              templStr.push(
                { type: 'TemplateElement', 
                 start: startElem, end: c, tail: false,
                 loc: { start: { line: li, column: col }, end: { line: this.li, column: this.col } },        
                 value: { raw : src.slice(startElem, c ).replace(/\r\n|\r/g,'\n'), 
                        cooked: currentElemContents   } } );

              this.c = c + 2; // ${
              this.col += 2; // ${
             
              this.next(); // this must be done manually because we must have a lookahead before starting to parse an actual expression
              templExpressions.push( this.parseExpr(CONTEXT_NONE) );
              this.assert ( this. lttype === '}');

              currentElemContents = "";
              startElemFragment = startElem = c = this.c; // right after the '}'
              startColIndex = c;
              li = this.li;
              col = this.col;
          }

          else
             c++ ;

          continue;

       case CHAR_CARRIAGE_RETURN: 
           currentElemContents += src.slice(startElemFragment,c) + '\n' ;
           c++;
           if ( src.charCodeAt(c) === CHAR_LINE_FEED ) c++;
           startElemFragment = startColIndex = c;
           this.li++;
           this.col = 0;
           continue ;
 
       case CHAR_LINE_FEED:
           currentElemContents += src.slice(startElemFragment,c) + '\n';
           c++;
           startElemFragment = startColIndex = c;
           this.li++;
           this.col = 0;
           continue; 
 
       case 0x2028: case 0x2029:
           currentElemContents += src.slice(startElemFragment,c) + src.charAt(c);
           startColIndex = c;
           c++; 
           startElemFragment = c;
           this.li++;
           this.col = 0;           
           continue ;
 
       case CHAR_BACK_SLASH :
           this.c = c; 
           currentElemContents += src.slice( startElemFragment, c ) + this.readEsc();
           c  = this.c;
           c++;
           if ( this.col === 0 ) // if we had an escaped newline 
             startColIndex = c;
           
           startElemFragment = c ;
           continue ;
    }

    c++ ;
  }

  this.assert( ch === CHAR_BACKTICK );
  
  if ( startElem < c ) {
     this.col += ( c - startColIndex );
     if ( startElemFragment < c )
       currentElemContents += src.slice( startElemFragment, c );
  }
  else currentElemContents = "";

  templStr.push({
     type: 'TemplateElement',
     start: startElem,
     loc: { start : { line: li, column: col }, end: { line: this.li, column: this.col } },
     end: startElem < c ? c : startElem ,
     tail: !false,
     value: { raw: src.slice(startElem,c).replace(/\r\n|\r/g,'\n'), 
              cooked: currentElemContents }
  }); 

  c++; // backtick  
  this.col ++ ;

  var n = { type: 'TemplateLiteral', start: startc, quasis: templStr, end: c,
       expressions: templExpressions , loc: { start: startLoc, end : this.loc() } };

  this.c = c;
  this.next(); // prepare the next token  

  return n
};


},
function(){
this .validateID  = function (e) {
  var n = e || this.ltval;

  SWITCH:
  switch (n.length) {
     case  1:
         break SWITCH;
     case  2: switch (n) {
         case 'do':
         case 'if':
         case 'in':
            return this.errorReservedID();
         default: break SWITCH;
     }
     case 3: switch (n) {
         case 'int' :
            if ( this.v > 5 )
                break SWITCH;
          return  this. errorReservedID();

         case 'let' :
            if ( this.v <= 5 || !this.tight )
              break SWITCH;
         case 'for' : case 'try' : case 'var' : case 'new' :
             return this.errorReservedID();

         default: break SWITCH;
     }
     case 4: switch (n) {
         case 'byte': case 'char': case 'goto': case 'long':
            if ( this. v > 5 ) break SWITCH;
         case 'case': case 'else': case 'this': case 'void':
         case 'with': case 'enum':
            return this.errorReservedID();

         default:
            break SWITCH;
     }
     case 5: switch (n) {
         case 'await':
            if ( this. isScript ) break SWITCH;
         case 'final':
         case 'float':
         case 'short':
            if ( this. v > 5 ) break SWITCH;
            return this.errorReservedID();
    
         case 'yield': 
            if ( !( this.tight || ( this.scopeFlags & SCOPE_YIELD ) ) )
              break SWITCH;

         case 'break': case 'catch': case 'class': case 'const':
         case 'super': case 'throw': case 'while': 
            return this.errorReservedID();

         default: break SWITCH;
     }
     case 6: switch (n) {
         case 'double': case 'native': case 'throws':
             if ( this. v > 5 )
                break SWITCH;
             return this.errorReservedID(); 
         case 'public':
         case 'static':
             if ( this.v > 5 && !this.tight )
               break SWITCH;
         case 'delete': case 'export': case 'import': case 'return':
         case 'switch': case 'typeof':
            return this.errorReservedID() ;

         default: break SWITCH;
     }
     case 7:  switch (n) {
         case 'package':
         case 'private':
            if ( this.tight ) return this.errorReservedID();
         case 'boolean':
            if ( this.v > 5 ) break;
         case 'default': case 'extends': case 'finally':
             return this.errorReservedID();

         default: break SWITCH;
     }
     case 8: switch (n) {
         case 'abstract': case 'volatile':
            if ( this.v > 5 ) break;
         case 'continue': case 'debugger': case 'function':
            return this.errorReservedID () ;

         default: break SWITCH;
     }
     case 9: switch (n) {
         case 'interface':
            if ( this.tight ) this.resv();
         case 'protected': case 'transient':
            if ( this.v <= 5 )
               this.errorReservedID() ;

         default: break SWITCH;
     }
     case 10: switch (n) {
         case 'implements':
            if ( this.v > 5 && !this.tight ) break ;
         case 'instanceof':
            this.errorReservedID() ;

         default: break SWITCH;
    }
    case 12: switch (n) {
      case 'synchronized':
         if ( this. v <= 5 ) this.errorReservedID() ;

      default: break SWITCH;
    }
  }

  return e ? null : this.id();
};

this.errorReservedID = function() {
    if ( !this.throwReserved ) {
       this.throwReserved = !false;
       return null;
    }
    this.err ( this. ltraw + ' is not an identifier '   )  ;
}



},
function(){
this . parseVariableDeclaration = function(context) {
     this.assert ( this.canBeStatement );
     this.canBeStatement = false;

     var startc = this.c0, startLoc = this.locBegin(), kind = this.ltval;
     var elem = null;

     this.next () ;
     elem = this.parseVariableDeclarator(context);
     if ( elem === null ) {
       this.assert(kind === 'let');
       return null; 
     }

     var list = [elem];
     if ( !this.unsatisfiedAssignment ) // parseVariableDeclarator sets it when it finds an uninitialized BindingPattern
          while ( this.lttype === ',' ) {
            this.next();     
            elem = this.parseVariableDeclarator(context);
            this.assert(elem);
            list.push(elem);
          }

     var lastItem = list[list.length-1];
     var endI = 0, endLoc = null;

     if ( !(context & CONTEXT_FOR) ) {
       endI = this.semiI() || lastItem.end;
       endLoc = this.semiLoc() || lastItem.loc.end; 
     }
     else {
       endI = lastItem.end;
       endLoc = lastItem.loc.end;
     }

     this.foundStatement  = !false ;

     return { declarations: list, type: 'VariableDeclaration', start: startc, end: endI,
              loc: { start: startLoc, end: endLoc }, kind: kind };
};

this . parseVariableDeclarator = function(context) {
  if ( (context & CONTEXT_FOR) &&
       this.lttype === 'Identifier' &&
       this.ltval === 'in' )
      return null;

  var head = this.parsePattern(), init = null;
  if ( !head ) return null;

  if ( this.lttype === 'op' && this.ltraw === '=' )  {
       this.next();
       init = this.parseNonSeqExpr(PREC_WITH_NO_OP,context);
  }
  else if ( head.type !== 'Identifier' ) { // our pattern is an arr or an obj?
       this.assert ( context & CONTEXT_FOR );  // bail out in case it is not a 'for' loop's init
       if( !this.unsatisfiedAssignment )
         this.unsatisfiedAssignment  =  head;     // an 'in' or 'of' will satisfy it
  }

  var initOrHead = init || head;
  return { type: 'VariableDeclarator', id: head, start: head.start, end: initOrHead.end,
           loc: { start: head.loc.start, end: initOrHead.loc.end }, init: init && core(init) };
};


},
function(){

this.parseYield = function(context) {
  var arg = null,
      deleg = false;

  var c = this.c, li = this.li, col = this.col;
  var startc = this.c0, startLoc = this.locBegin();

  this.next();
  if (  !this.newLineBeforeLookAhead  ) {
     if ( this.lttype === 'op' && this.ltraw === '*' ) {
            deleg = !false;
            this.next();
            arg = this.parseNonSeqExpr ( PREC_WITH_NO_OP, context & CONTEXT_FOR );
            this.assert(arg);
     }
     else
        arg = this. parseNonSeqExpr ( PREC_WITH_NO_OP, (context & CONTEXT_FOR)|CONTEXT_NULLABLE );
  }

  var endI, endLoc;

  if ( arg ) { endI = arg.end; endLoc = arg.loc.end; }
  else { endI = c; endLoc = { line: li, column: col }; }  

  var n = { type: 'YieldExpression', argument: arg && core(arg), start: startc, delegate: deleg,
           end: endI, loc: { start : startLoc, end: endLoc } }

  if ( !this.firstYS )
        this.firstYS = n;
 
  return n;
};



}]  ],
[Scope.prototype, [function(){
     
function name(n) { return n + '%'; }

this.assert = function(cond, message) {
     if ( !cond ) 
        throw new Error(message);
};

this.reference = function(n, refMode) {
   this.assert(refMode);

   if ( this.scopeMode === SCOPE_CATCH && this.findInCatchVars(n) ) return;

   var ref = this. findDefinitionInScope(n); 

   if ( this.scopeMode === SCOPE_FUNC && ref && ref.scope !== this ) {
     var synth = ref.synthName = ref.scope.synthNameInSurroundingFuncScope(ref.realName);
     this.defined[name(synth)] = ref;
     ref = this.defined[name(n)] = null;
   }

   if ( !ref )
     ref = this.findReferenceInScope(n);
   
   if ( !ref )
     ref = this.unresolved[name(n)] = { realName: n, refMode: 0, scope: this };

   ref.refMode |= refMode;
};

this.findReferenceInScope = function(n) {
   n = name(n);
   return has.call(this.unresolved, n) ?
          this.unresolved[n] : null;
};

this.findDefinitionInScope = function(n) {
   n = name(n);
   return has.call(this.defined, n) ?
          this.defined[n] : null;
};

this.findInCatchVars = function(n) {
   n = name(n);
   return has.call( this.catchVars, n ) ?
          this.catchVars[n]: null;
};

this.define = function(n, varDef) {
    return this.defineByScopeMode[this.scopeMode].call(this, n, varDef);

};

function lexicalDefine(n, defMode) {
   var def = this.findDefinitionInScope(n);
   if ( defMode === LET_OR_CONST ) {
     this.assert( !def );
     this.resolve(n);
     return;
   }

   if ( def && def.scope === this.surroundingFunc )
     return;

   var scope = this;
   do {
     scope.defineHoisted(n);
     scope = scope.parentScope;
   } while ( scope != this.surroundingFunc );

   scope.define(n);
}
      
function catchDefine(n, defMode) {
   if ( defMode === VAR_DEF && this.findInCatchVars(n) )
     return;

   this.assert ( defMode !== LET_OR_CONST || !this.findInCatchVars(n) );
   return lexicalDefine(n, defMode);
}

function surroundingFuncScopeDefine(n, defMode) {   
   var def = this.findDefinitionInScope(n);
   if ( def && def.scope !== this ) {
      var synth =  def.scope.synthNameInSurroundingFuncScope(def.realName);
      def.synthName = synth;
      this.defined[name(synth)] = def;
      def = null;
   }

   if ( !def ) {
      this.resolve(n);
      return;
   }

   this.assert(defMode !== LET_OR_CONST );
}

this.defineByScopeMode = {};
var dbsm = this.defineByScopeMode;

dbsm[SCOPE_LEXICAL] = lexicalDefine;
dbsm[SCOPE_CATCH] = catchDefine;
dbsm[SCOPE_FUNC] = surroundingFuncScopeDefine;

this.resolve = function(n, scope) {
   var ref = this.findReferenceInScope(n);
   if ( ref ) this.unresolved[name(n)] = null;
   else ref = { realName: n, refMode: 0, scope: scope || this };
   this.defined[name(n)] = ref;
};

this.defineHoisted = function(n) {
  this.assert(this.scopeMode !== SCOPE_FUNC);
  var def = this.findDefinitionInScope(n)  ;
  this.assert ( !def || def.scope === this.surroundingFunc );     

  this.resolve(n, this.surroundingFunc);
};      
      
this.synthNameInSurroundingFuncScope = function(n) {
   var num = 0, synth = n;
   while ( !false ) {
      synth = name(synth);
           
      if ( !has.call(this.surroundingFunc.defined, synth) &&
           !has.call(this.surroundingFunc.unresolved, synth) &&
           !has.call(this.unresolved, synth) &&
           !(has.call(this.defined, synth) && num) )
        break;

      num++;
      synth = n + "" + num;
   } 

   return num ? n + "" + num : n;
};

this.closeScope = function() {
    var id = null;
  
    for ( id in this.unresolved ) {
       var unresolved = this.unresolved[ id ];
       if (!unresoved) continue;
       this.parentScope.reference(unresolved.realName, 
           this.scopeMode === SCOPE_FUNC ? REF_I : unresolved.refMode );
    }
 
    for ( id in this.defined ) {
       var synth = this.defined[id].synthName =
            this.synthNameInSurroundingFuncScope (this.defined[id].realName);
       this.surroundingFunc.defined[name(synth)] = this.defined[id];
    }
};

}]  ],
null,
null,
null,
null,
null,
null]);
this.parse = function(src, isModule ) {
  var newp = new Parser(src, isModule);
  return newp.parseProgram();
};

this.Parser = 
Parser;  

this.Scope = Scope;

;}).call (this)