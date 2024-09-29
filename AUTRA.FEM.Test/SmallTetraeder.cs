using AUTRA.FEM.Entities.BoundaryConditions.Constraints;
using AUTRA.FEM.Entities.BoundaryConditions.Forces;
using AUTRA.FEM.Entities.Elements;
using AUTRA.FEM.Entities.Nodes;
using AUTRA.FEM.Entities.Structures;
using System;
using System.Collections.Generic;

namespace AUTRA.FEM.Test
{
    internal class SmallTetraeder
    {
        public static TrussStructure createStructure()
        {
            //var structure = new TrussStructure();
            double lb = 15.0;
            double r = 457.2 / 2000;
            double t = 10.0 / 1000;
            double a = Math.PI * (Math.Pow(r, 2) - Math.Pow(r - t, 2));
            double e = 2.1e11;
            Constraint3D c1 = new Constraint3D(false, false, false);
            Constraint3D c2 = new Constraint3D(true, true, false);
            NodalForce3D f = new NodalForce3D(0, -20e3, -100e3);
            // create nodes
            Node3D n1 = new Node3D(1,0.0, 0.0, lb* Math.Sqrt(2.0 / 3.0), f);
		     Node3D n2 = new Node3D(2,0.0, lb / Math.Sqrt(3), 0, c1);
		     Node3D n3 = new Node3D(3,-lb / 2,-lb / Math.Sqrt(12.0), 0, c1);
		     Node3D n4 = new Node3D(4,lb / 2,-lb / Math.Sqrt(12.0), 0,c2);
		     
            var nodes = new List<Node3D> { n1, n2, n3, n4 };

           

            var e1 = new LineElement(1,n1,n2,e,a);
            var e2 = new LineElement(2,n1,n3,e,a);
            var e3 = new LineElement(3,n1,n4,e,a);
            var e4 = new LineElement(4,n2,n3,e,a);
            var e5 = new LineElement(5,n3,n4,e,a);
            var e6 = new LineElement(6,n4,n2,e,a);
           
            var eles = new List<LineElement> { e1, e2, e3, e4,e5,e6 };
            var structure = new TrussStructure(nodes, eles);
		     // return the new structure
		     return structure;
        }


        
        static void Main(string[] args)
        {
           var structure = createStructure();
            var postProcessing = structure.Solve();
            var force = postProcessing.ElementNormalForce;
        }
    }
}
