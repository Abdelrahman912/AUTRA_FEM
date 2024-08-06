using AUTRA.FEM.Entities.Elements;
using AUTRA.FEM.Entities.Geometries;
using AUTRA.FEM.Entities.Solver;
using MathNet.Numerics.LinearAlgebra;
using MathNet.Spatial.Euclidean;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AUTRA.FEM.Entities.Results
{
    public class PostProcessing
    {
        #region Private Fields
        private readonly Geometry _geometry;
        private readonly DofHandler _dofHandler;
        #endregion

        #region Properties
        public Dictionary<int, Vector3D> NodalDisplacements { get;}
        public Dictionary<int,double> ElementNormalForce { get; }
        #endregion

        #region Constructor
        public PostProcessing(Geometry geometry,DofHandler dh, Vector<double> udofs)
        {
            _geometry = geometry;
            _dofHandler = dh;
            NodalDisplacements = PostProcessDisplacements(udofs);
            ElementNormalForce = PostProcessElementForces();
        }

        #endregion

        #region Methods

        private double CalculateElementNormalForce(LineElement ele)
        {
            var uList = NodalDisplacements[ele.Node1.Id]
                .ToVector()
                .ToList();

            uList.AddRange(NodalDisplacements[ele.Node2.Id].ToVector().ToList());
            var u = Vector<double>.Build.DenseOfEnumerable(uList);
            var T = ele.T;
            var B = ele.B;
            var uLocal = T * u;
            var strain = B * uLocal;
            var stress = ele.E * strain[0];
            var force = stress * ele.A;
            return force;
        }

        private Dictionary<int, double> PostProcessElementForces()
        {
           var eles = _geometry.Elements;
            var elementForces = eles.ToDictionary(ele => ele.Id, ele => CalculateElementNormalForce(ele));
            return elementForces;
        }

        private Dictionary<int, Vector3D> PostProcessDisplacements(Vector<double> udofs)
        {
            var nodes = _geometry.Nodes;
            var nodalDisplacements = nodes.ToDictionary(node => node.Id, node =>
            {
                var dofs = _dofHandler.GetNodeDofs(node.Id);
                var displacements = new double[3] { 0, 0, 0 };
                for (int i = 0; i < 3; i++)
                {
                    if (dofs[i] != -1)
                    {
                        displacements[i] = udofs[dofs[i]];
                    }
                }
                return new Vector3D(displacements[0], displacements[1], displacements[2]);
            });
            return nodalDisplacements;
        }
        #endregion

    }
}
