this.parseParen = function(context) {
  var startc = this.c0,
      startLoc = this.locBegin(),
      elem = null,
      elemContext = CTX_NULLABLE|CTX_PAT;
      list = null;
  
  var prevys = this.suspys,
      hasRest = false,
      st = ERR_NONE_YET, se = null, so = null,
      pt = ERR_NONE_YET, pe = null, po = null; 

  if (context & CTX_PAT) {
    this.pt = this.st = ERR_NONE_YET;
    this.pe = this.po =
    this.se = this.so = null;
    this.suspys = null;
    elemContext |= CTX_PARAM;
  }
  else
    context |= CTX_NO_SIMPLE_ERR;

  this.next();
  while (true) {
    elem = this.parseNonSeqExpr(PREC_WITH_NO_OP, elemContext);
    if (elem === null) {
      if (this.ltval === '...') {
        if (!(elemContext & CTX_PARAM)) {
          this.st = ERR_UNEXPECTED_REST;
          this.se = this.so = null;
          this.simpleError_flush();
        }
        elem = this.parseSpreadElement(elemContext);
        hasRest = true;
      }
      else if (list)
        this.err('unexpected.lookahead');
      else break;
    }

    if (elemContext & CTX_PARAM) {
      // TODO: could be `pt === ERR_NONE_YET`
      if (!(elemContext & CTX_HAS_A_PARAM_ERR)) {
        if (this.pt === ERR_NONE_YET) {
          // TODO: function* l() { ({[yield]: (a)})=>12 }
          if (elem.type === PAREN_TYPE) {
            this.pt = ERR_PAREN_UNBINDABLE;
            this.pe = elem; this.po = core(elem);
          }
          else if(this.suspys) {
            this.pt = ERR_YIELD_OR_SUPER;
            this.pe = this.suspys; this.po = elem;
          }
        }
        if (this.pt !== ERR_NONE_YET) {
          pt = this.pt; pe = this.pe; po = this.po;
          elemContext |= CTX_HAS_A_PARAM_ERR;
        }
      }

      // TODO: could be `st === ERR_NONE_YET`
      if (!(elemContext & CTX_HAS_A_SIMPLE_ERR)) {
        if (this.st === ERR_NONE_YET && hasRest) {
          this.st = ERR_UNEXPECTED_REST;
          this.se = this.so = elem;
        }
        if (this.st !== ERR_NONE_YET) {
          st = this.st; se = this.se; so = this.so;
          elemContext |= CTX_HAS_A_SIMPLE_ERR;
        }
      }
    }

    if (hasRest)
      break;

    if (this.lttype === ',') {
    //if (hasRest)
    //  this.err('unexpected.lookahead');
      if (list === null)
        list = [core(elem)];
      else
        list.push(core(elem));
      this.next();
    }
    else break;
  }

  var n = {
      type: PARAN_TYPE,
      expr: list ? {
        type: 'SequenceExpression',
        expressions: list,
        start: list[0].start,
        end: list[list.length-1].end,
        loc: {
          start: list[0].loc.start,
          end: list[list.length-1].loc.end
        } 
      } : elem,
      start: startc,
      end: this.c,
      loc: { start: startLoc, end: this.loc() }
  };

  if (!this.expectType_soft(')'))
    this.err('unfinished.paren');

  if ((context & CTX_PARAM) &&
     elem === null && list === null) {
    this.st = ERR_MISSING_ARROW;
    this.pe = this.po = n;
  }

  // TODO: this looks a little like a hack
  if (this.lttype !== 'op' || this.ltraw !== '=>') {
    this.simpleErrors_flush();
    if (this.prevys !== null)
      this.suspys = prevys;
  }

  return n;
};

