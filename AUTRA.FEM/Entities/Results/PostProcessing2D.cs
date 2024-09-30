using AUTRA.FEM.Entities.Elements;
using AUTRA.FEM.Entities.Geometries;
using AUTRA.FEM.Entities.Solver.DofHandler;
using AUTRA.FEM.Entities.Structures;
using MathNet.Numerics.LinearAlgebra;
using MathNet.Spatial.Euclidean;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AUTRA.FEM.Entities.Results
{
    public class PostProcessing2D
    {
        #region private fields
        private readonly GridGeometry _geometry;
        private readonly DofHandler2D _dofHandler;
        #endregion

        #region Properties
        public Dictionary<int, Vector2D> NodalDisplacements { get; }
        public Dictionary<int, List<StressTensor>> ElementStressTensor { get; }
        public Dictionary<int, Vector<double>> ElementDisplacements { get; }

        #endregion

        #region Constructors
        public PostProcessing2D(GridGeometry geometry, DofHandler2D dh, Vector<double> udofs)
        {
            _geometry = geometry;
            _dofHandler = dh;
            NodalDisplacements = PostProcessDisplacements(udofs);
            ElementDisplacements = PostProcessElementDisplacements(udofs);
            ElementStressTensor = PostProcessElementStress();
        }




        #endregion


        #region Methods
        private Dictionary<int, Vector2D> PostProcessDisplacements(Vector<double> udofs)
        {
            var nodes = _geometry.Nodes;
            var nodalDisplacements = nodes.ToDictionary(node => node.Id, node =>
            {
                var dofs = _dofHandler.GetNodeDofs(node.Id);
                var displacements = new double[2] { 0, 0 };
                for (int i = 0; i < dofs.Count; i++)
                {
                    if (dofs[i] != -1)
                    {
                        displacements[i] = udofs[dofs[i]];
                    }
                }
                return new Vector2D(displacements[0], displacements[1]);
            });
            return nodalDisplacements;
        }

        private Dictionary<int, List<StressTensor>> PostProcessElementStress()
        {
            return _geometry.Elements.Select((e) =>
             {
                 var u = ElementDisplacements[e.Id];
                 var C = ((Quadrilateral)e).C;
                 var cellValues = _dofHandler.GetCellValues(e.Id);
                 var stressTensors = cellValues.Values.Select(val =>
                 {
                     var gp = val.GaussPoint;
                     var B = val.B;
                     var stress = C * B * u;
                     return new StressTensor(gp, stress);
                 }).ToList();
                 return Tuple.Create(e.Id, stressTensors);
             }).ToDictionary(tup => tup.Item1, tup => tup.Item2);
        }

        private Dictionary<int, Vector<double>> PostProcessElementDisplacements(Vector<double> udofs)
        {
            var elements = _geometry.Elements;
            var elementDisplacements = elements.ToDictionary(ele => ele.Id, ele =>
            {
                var dofs = _dofHandler.GetElementDofs(ele.Id);
                var displacements = new double[dofs.Count];
                for (int i = 0; i < dofs.Count; i++)
                {
                    if (dofs[i] != -1)
                    {
                        displacements[i] = udofs[dofs[i]];
                    }
                }
                return Vector<double>.Build.DenseOfArray(displacements);
            });
            return elementDisplacements;

        }

        #endregion
    }
}
