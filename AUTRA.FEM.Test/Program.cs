using AUTRA.FEM.Entities.BoundaryConditions.Constraints;
using AUTRA.FEM.Entities.BoundaryConditions.Forces;
using AUTRA.FEM.Entities.Elements;
using AUTRA.FEM.Entities.Nodes;
using AUTRA.FEM.Entities.Structures;
using System;
using System.Collections.Generic;
using System.Text;

namespace AUTRA.FEM.Test
{
    internal class Program
    {
        static void Main(string[] args)
        {
            // test truss
            var smallTetraeder = TestProblems.CreateSmallTetraeder();
            var postProcessing = smallTetraeder.Solve();
            var force = postProcessing.ElementNormalForce;

            //test plane stress/strain structure (e.g. linear plane stress)
            var planeStress = TestProblems.CreatePlaneStressLinearStructure();
            var linearPP = planeStress.Solve();
            Console.WriteLine(linearPP.ToString());

            //test plane stress/strain structure (e.g. quadratic plane stress)
            var planeStressQuad = TestProblems.CreatePlaneStressQuadraticStructure();
            var quadPP = planeStressQuad.Solve();
            Console.WriteLine(quadPP.ToString());


        }
    }
}
