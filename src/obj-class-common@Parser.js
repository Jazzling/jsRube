
this .parseMeth = function(name, isClass) {
   var val = null; 
   var y = this.y;

   if ( !isClass ) {
     val = this.parseFunc(CONTEXT_NONE,ARGLIST_AND_BODY,ANY_ARG_LEN );
     return { type: 'Property', key: core(name), start: name.start, end: val.end,
              kind: 'init', computed: name.type === PAREN,
              loc: { start: name.loc.start, end : val.loc.end },
              method: !false, shorthand: false, value : val, y: y };
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
            value: val,    'static': false, y: y };
};

this .parseGen = function(isClass ) {
  var startc = this.c - 1,
      startLoc = this.locOn(1);
  this.next();
  var name = null;
  var y = 0;

  switch ( this.lttype ) {
     case 'Identifier':
        if (isClass && this.ltval === 'constructor' )
         this['class.mem.name.is.ctor']('gen',startc,startLoc);

        name = this.memberID();
        break ;

     case '[':
        this.y = 0;
        name = this.memberExpr();
        y = this.y;
        break ;

     case 'Literal' :
        if ( isClass && this.ltval === 'constructor' )
          this['class.mem.name.is.ctor']('gen',startc,startLc);
        name = this.numstr();
        break ;

     default:
        return this['class.or.obj.mem.name'](isClass,startc,startLoc);
  }

  var val = null;

  if ( !isClass ) {
     val  =  this.parseFunc ( CONTEXT_NONE, ARGLIST_AND_BODY_GEN, ANY_ARG_LEN );

     return { type: 'Property', key: core(name), start: startc, end: val.end,
              kind: 'init', computed: name.type === PAREN,
              loc: { start: startLoc , end : val.loc.end },
              method: !false, shorthand: false, value : val, y: y };
  }

  val = this.parseFunc(  CONTEXT_NONE , ARGLIST_AND_BODY_GEN|METH_FUNCTION, ANY_ARG_LEN );

  this.y = y;
  return { type: 'MethodDefinition', key: core(name), start: startc, end: val.end,
           kind: 'method', computed: name.type === PAREN,
           loc : { start: startLoc, end: val.loc.end },    'static': false, value: val, y: y };
};

this . parseSetGet= function(isClass) {
  var startc = this.c0,
      startLoc = this.locBegin();

  var c = this.c, li = this.li, col = this.col;

  var kind = this.ltval;
  this.next();

  var strName = null;
  var name = null;

  var y = 0;
  switch ( this.lttype ) {
      case 'Identifier':
         if (isClass) strName = this.ltval;
         name = this.memberID();
         break;
      case '[':
         this.y = 0;
         name = this.memberExpr();
         y = this.y;
         break;
      case 'Literal':
         if (isClass) strName = this.ltval;
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
       this.y = y;
       return { type: 'Property', key: core(name), start: startc, end: val.end,
             kind: kind, computed: name.type === PAREN,
             loc: { start: startLoc, end: val.loc.end }, method: false,
             shorthand: false, value : val, y: y };
  }
  
  if ( strName === 'constructor' )
    this['class.mem.name.is.ctor'](kind, startc, startLoc);

  val = this.parseFunc ( CONTEXT_NONE , ARGLIST_AND_BODY|METH_FUNCTION, kind === 'set' ? 1 : 0 )

  this.y = y;
  return { type: 'MethodDefinition', key: core(name), start: startc, end: val.end,
           kind: kind, computed: name.type === PAREN,
           loc : { start: startLoc, end: val.loc.end }, 'static': false, value: val, y: y };
};


