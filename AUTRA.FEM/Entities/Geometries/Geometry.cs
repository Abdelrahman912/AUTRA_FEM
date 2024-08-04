using AUTRA.FEM.Entities.Elements;

namespace AUTRA.FEM.Entities.Geometries
{
    public class Geometry
    {
        #region Properties
        public List<LineElement> Elements { get; }
        public List<Node> Nodes { get; }
        public int NoNodes => Nodes.Count;
        public int NoElements => Elements.Count;
        #endregion

        #region Constructors
        public Geometry(List<LineElement> eles, List<Node> nodes)
        {
            Elements = eles;
            Nodes = nodes;
        }
        #endregion


        #region Methods
        public Node GetNodeFromId(int id)
        {
            var res = Nodes.FirstOrDefault(n => n.Id == id);
            if (res == null)
            {
                throw new KeyNotFoundException($"Node with id {id} not found");
            }
            else
            {
                return res;
            }
        }

        public LineElement GetElementFromId(int id)
        {
            var res = Elements.FirstOrDefault(e => e.Id == id);
            if (res == null)
            {
                throw new KeyNotFoundException($"Element with id {id} not found");
            }
            else
            {
                return res;
            }
        }
        #endregion
    }
}
