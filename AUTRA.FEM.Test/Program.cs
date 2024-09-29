using AUTRA.FEM.Entities.BoundaryConditions.Constraints;
using AUTRA.FEM.Entities.BoundaryConditions.Forces;
using AUTRA.FEM.Entities.Elements;
using AUTRA.FEM.Entities.Nodes;
using AUTRA.FEM.Entities.Structures;
using System;
using System.Collections.Generic;

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

            //test plane stress/strain
            var planeStress = TestProblems.CreatePlaneStressStructure();
            var u = planeStress.Solve();
        }
    }
}
