using AUTRA.FEM.Entities.Elements;
using AUTRA.FEM.Entities.Geometries;
using AUTRA.FEM.Entities.Solver;
using MathNet.Numerics.LinearAlgebra;
using AUTRA.FEM.Entities.Results;
using System.Collections.Generic;
using AUTRA.FEM.Entities.Nodes;

namespace AUTRA.FEM.Entities.Structures
{
    public class TrussStructure
    {


        #region Properties
        public SkeletonGeometry Geometry { get;}
        public DofHandler DofHandler { get;  }
        public Assembler Assembler { get; }

        #endregion


        #region Constructors
        public TrussStructure(List<Node3D> nodes, List<LineElement> elements)
        {
           Geometry= new SkeletonGeometry(elements, nodes);
            DofHandler = new DofHandler(Geometry);
            Assembler = new Assembler(DofHandler);
        }
        #endregion

        #region Methods
        public PostProcessing Solve()
        {
            var (K, F) = Assembler.Assemble();
            var u = K.Solve(F);
            var postProcessing = new PostProcessing(Geometry, DofHandler, u);
            return postProcessing;
        }

        #endregion
    }
}