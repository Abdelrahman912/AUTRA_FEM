using AUTRA.FEM.Entities.ConstitutiveLaw;
using AUTRA.FEM.Entities.Elements;
using AUTRA.FEM.Entities.Geometries;
using AUTRA.FEM.Entities.Interpolation;
using AUTRA.FEM.Entities.Nodes;
using AUTRA.FEM.Entities.NumericalIntegration;
using AUTRA.FEM.Entities.Results;
using AUTRA.FEM.Entities.Solver;
using AUTRA.FEM.Entities.Solver.DofHandler;
using MathNet.Numerics.LinearAlgebra;
using System.Collections.Generic;

namespace AUTRA.FEM.Entities.Structures
{
    public class PlaneStructure
    {
        #region private fields

        private readonly FEValues.FEValues _feValues;

        #endregion

        #region Properties
        public GridGeometry Grid { get;  }
        public DofHandler2D DofHandler { get; set; }
        public Assembler Assembler { get; set; }


        #endregion

        #region Constructors
        public PlaneStructure(List<Node2D> nodes, List<Quadrilateral> elements,
                              ConstitutiveLaw2D law,
                              NoQuadraturePoints nqps,
                              Lagrange ip)
        {
            Grid = new GridGeometry(elements, nodes);
            var qr = new QuadratureRule(nqps);
            _feValues = new FEValues.FEValues(qr, ip);
            DofHandler = new DofHandler2D(Grid,_feValues);
            Assembler = new Assembler(DofHandler);
        }
        #endregion


        #region Methods
        public PostProcessing2D Solve()
        {
            var (K, F) = Assembler.Assemble();
            var u = K.Solve(F);
            var pp = new Results.PostProcessing2D(Grid, DofHandler, u);
            return pp;
        }
        #endregion

    }
}
