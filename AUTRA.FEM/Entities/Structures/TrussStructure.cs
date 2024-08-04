using AUTRA.FEM.Entities.Elements;
using AUTRA.FEM.Entities.Geometries;
using AUTRA.FEM.Entities.Solver;
using MathNet.Numerics.LinearAlgebra;

namespace AUTRA.FEM.Entities.Structures
{
    public class TrussStructure
    {


        #region Properties
        public Geometry Geometry { get;}
        public DofHandler DofHandler { get;  }
        public Assembler Assembler { get; }

        #endregion


        #region Constructors
        public TrussStructure(List<Node> nodes, List<LineElement> elements)
        {
           Geometry= new Geometry(elements, nodes);
            DofHandler = new DofHandler(Geometry);
            Assembler = new Assembler(DofHandler);
        }
        #endregion

        #region Methods
        public Vector<double> Solve()
        {
            var (K, F) = Assembler.Assemble();
            var u = K.Solve(F);
            return u ;
        }

        #endregion
    }
}