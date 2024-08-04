using AUTRA.FEM.Entities.Elements;
using AUTRA.FEM.Entities.Geometries;
using MathNet.Numerics.LinearAlgebra;

namespace AUTRA.FEM.Entities.Solver
{
    public class DofHandler
    {
        #region Private Fields
        private readonly Dictionary<int, List<int>> _nodeDofNumbers;
        private readonly Dictionary<int, List<int>> _elesDofNumbers;
        private readonly Geometry _geometry;
        private Lazy<int> _noDofs ;
        private Lazy<List<int>> _elesId;
        private Lazy<List<int>> _nodesId;
        #endregion

        #region Properties
        public int NoDofs => _noDofs.Value;
        public List<int> ElementsId => _elesId.Value;
        public List<int> NodesId => _nodesId.Value;

        #endregion

        #region Constructor
        public DofHandler(Geometry geometry)
        {
            _geometry = geometry;
            _nodeDofNumbers = new Dictionary<int, List<int>>();
            _elesDofNumbers = new Dictionary<int, List<int>>();
            _noDofs = new Lazy<int>(() => EnumerateDofs());
            _elesId = new Lazy<List<int>>(() => _geometry.Elements.Select(e => e.Id).ToList());
            _nodesId = new Lazy<List<int>>(() => _geometry.Nodes.Select(n => n.Id).ToList());
        }
        #endregion

        #region Methods
        private int EnumerateNodeDofs()
        {
            if (_nodeDofNumbers.Count > 0)
            {
                return NoDofs;
            }

            int dofNumber = 0;
            foreach (var node in _geometry.Nodes)
            {
                var dofs = node.Constraint.Free.Select(b => b ? dofNumber++ : -1).ToList();
                _nodeDofNumbers.Add(node.Id, dofs);
            }
            return dofNumber;
        }

        private void EnumerateElementDofs()
        {
            if (_elesDofNumbers.Count > 0)
            {
                return;
            }
            foreach (var ele in _geometry.Elements)
            {
                var n1 = ele.Node1;
                var n2 = ele.Node2;
                var nodes = new List<Node> { n1, n2 };
                var dofs = nodes.SelectMany(n => _nodeDofNumbers[n.Id]).ToList();
                _elesDofNumbers.Add(ele.Id, dofs);
            }
        }

        private int EnumerateDofs()
        {
            var ndofs = EnumerateNodeDofs();
            EnumerateElementDofs();
            return ndofs;
        }

        public List<int> GetElementDofs(int eleId)
        {
            return _elesDofNumbers[eleId];
        }

        public List<int> GetNodeDofs(int nodeId)
        {
            return _nodeDofNumbers[nodeId];
        }

        public Matrix<double> GetElementStiffnessMatrix(int eleId)
        {
            return _geometry.GetElementFromId(eleId).ComputeStiffnessMatrix();
        }

        public Vector<double> GetNodalForce(int nodeId)
        {
            return _geometry.GetNodeFromId(nodeId).NodalForce.Components.ToVector();
        }

        #endregion


    }
}
