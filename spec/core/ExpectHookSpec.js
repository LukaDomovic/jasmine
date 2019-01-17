describe('Expectation-Hook', function() {
    it('is added to before and after expect functions in order to the suite', function() {
        var env = new jasmineUnderTest.Env(),
         suite = new jasmineUnderTest.Suite({
          env: env,
          description: "I am a suite"
         }),

        outerBefore = jasmine.createSpy('outerBeforeEachExpect'),
        outerAfter = jasmine.createSpy('outerAfterEachExpect'),
        innerBefore = jasmine.createSpy('insideBeforeEachExpect');
        innerAfter = jasmine.createSpy('insideAfterEachExpect');
    
        suite.beforeEachExpect(outerBefore);
        suite.afterEachExpect(outerAfter);
        suite.beforeEachExpect(innerBefore);
        suite.afterEachExpect(innerAfter);

        expect(suite.beforeExFns).toEqual([innerBefore, outerBefore]);
        expect(suite.afterExFns).toEqual([innerAfter, outerAfter]);
    });

    it('throws an Error when it is called within a spec ', function() {
        expect(function() {
            beforeEachExpect();
        }).toThrow(new Error('\'beforeEachExpect\' should only be used in \'describe\' function'));
    });

    it('throws an Error when something other than a Function is passed as an argument', function() {
        var env = new jasmineUnderTest.Env();
        expect(function() {
            env.beforeEachExpect( 420 );
        }).toThrowError(/beforeEachExpect expects a function argument; received \[object .+]/);
        
        expect(function() {
            env.afterEachExpect( 420 );
        }).toThrowError(/afterEachExpect expects a function argument; received \[object .+\]/);
    });

    describe('context', function() {
        var contextBefore,
         contextAfter;

        beforeEachExpect(function() {
            contextBefore = this;
        });
        afterEachExpect(function() {
            contextAfter = this;
        });

        it('is the same as in the spec', function() {
            expect();
            expect(contextBefore).toEqual(this);
            expect(contextAfter).toEqual(this);
        });
    });

    describe('function', () => {
        var afterEachFunction = {
            afterEachFunc: function() {}
        },
            beforeEachFunction = {
                beforeEachFunc: function() {}
        };

        afterEachExpect( function() {
            afterEachFunction.afterEachFunc();
        });

        beforeEachExpect( function() {
            beforeEachFunction.beforeEachFunc();
        });
        
        it('to have been called after every expect', function() {
            spyOn(afterEachFunction, 'afterEachFunc');
            spyOn(beforeEachFunction, 'beforeEachFunc');
    
            expect(afterEachFunction.afterEachFunc).toHaveBeenCalledTimes(1);
            expect(beforeEachFunction.beforeEachFunc).toHaveBeenCalledTimes(2);
            expect(afterEachFunction.afterEachFunc).toHaveBeenCalledTimes(3);
            expect(beforeEachFunction.beforeEachFunc).toHaveBeenCalledTimes(4);
        });
    });



});