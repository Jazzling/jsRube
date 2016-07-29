     
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